const NodeUtil = require("../common/utils/node-util").NodeUtil;
const chokidar = require("chokidar");
const Path = require("path");

const WatchCodeChange = {
    watchCodeChange(startFn) {

        let unwatchedModules = NodeUtil.getLoadedSrcList();

        const start = (onChange) => {
            let processStop = startFn();

            let watchedModules = NodeUtil.getLoadedSrcList().filter((module) => unwatchedModules.indexOf(module) == -1);

            watchedModules = watchedModules.filter((p) => {
                return !require.cache[p].exports.persistentModule;
            });

            let watcher = chokidar.watch(watchedModules, {
                    ignoreInitial: true,
                    disableGlobbing: true,
                    followSymlinks : false,
                    usePolling: true,
                })
                    .on('change', onChange)
            ;

            return async () => {
                await processStop();

                watcher.close();

                NodeUtil.removeSrcCache(watchedModules);
            };
        };


        const restart = () => {
            stop().then(() => {
                stop = start(onChange);
            });
        };

        const onChange = (path) => {
            console.log("Found change", Path.basename(path));

            restart();
        };

        let stop = start(onChange);

        return {
            restart,
        };
    }
};

exports.WatchCodeChange = WatchCodeChange;