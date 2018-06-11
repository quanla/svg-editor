var chokidar = require("chokidar");
var gulp = require("gulp");
const path = require("path");

module.exports = {
    createCompiler({container,lookupDirs,distDir}) {
        var compileStyl = function() {
            return new Promise((resolve, reject)=> {

                var stylus = require("gulp-stylus");
                gulp.src(path.join(container.dir, container.file))
                    .pipe(stylus({
                        compress: true
                    }))
                    .pipe(gulp.dest(distDir))
                    .on("end", function() {
                        resolve();
                        console.log("Compiling stylus done");
                    })
                ;
            });
        };

        var inject_ = function() {
            return new Promise((resolve, reject)=> {

                var target = gulp.src(path.join(container.dir, container.file) );
                var sort = require('gulp-sort');
                var sources = gulp.src(lookupDirs.map((lookupDir) => path.join(lookupDir, "**/*.styl")), {read: false}).pipe(sort());

                var inject = require("gulp-inject");
                target
                    .pipe(inject(sources, {
                        starttag: '// inject:all',
                        endtag: '// endinject',
                        transform: function (filepath, file, i, length) {
                            let fullPath = file.cwd + filepath;
                            if (fullPath.startsWith(`${container.dir}`)) {
                                return null;
                            }
                            return `@import "${path.relative(container.dir, fullPath).replace(/\\/g, "/")}";`;
                        }
                    }))
                    .pipe(gulp.dest(container.dir))
                    .on("end", ()=>{
                        console.log("Inject stylus done");
                        resolve();
                    })
                ;
            });
        };

        return {
            watch: ()=> {
                inject_().then(() => {
                    compileStyl();

                    chokidar
                        .watch(lookupDirs.map((lookupDir) => path.join(lookupDir, "**/*.styl")), {
                            ignoreInitial: true
                        })
                        .on('add', function(event, path) {
                            inject_();
                        })
                        .on('unlink', function(event, path) {
                            inject_();
                        })
                        .on('change', function(event, path) {
                            compileStyl();
                        })
                    ;
                });

            },
            compile: ()=> {
                return inject_().then(compileStyl);
            }
        };
    }
};