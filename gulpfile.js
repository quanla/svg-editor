var gulp = require("gulp");
var spawn = require('child_process').spawn;
const fs = require("fs");

function createStylusCompiler() {
    return require("./src/build/stylus-compiler").createCompiler({
        container: {
            dir: `${__dirname}/src/editor/common/styl`,
            file: "style.styl",
        },
        lookupDirs: [
            `${__dirname}/src/editor`
        ],
        distDir: `${__dirname}/dist/css`,
    });
}

const stylusCompiler = createStylusCompiler();

function cmd(cmd, options = {
    stdio: "inherit"
    // stdio: "ignore"
}) {

    let split = cmd.split(" ");

    if (!/^win/.test(process.platform)) { // linux
        return spawn(split[0], split.slice(1), options);
    } else {
        return spawn('cmd', ['/s', "/c", ...split], options);
    }
}

gulp.task("build:watch", () => {
    stylusCompiler.watch();

    cmd("webpack --watch --mode development");
});

gulp.task("build", () => {
    stylusCompiler.compile();

    cmd("webpack --mode production");
});

gulp.task("dev", ["build:watch"], () => {
    const {ServerCore} = require("./src/server/server-core");
    ServerCore.start({
        port: 6633,
    });
});
