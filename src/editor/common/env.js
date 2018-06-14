const Env = {
    isMac() {
        return window.navigator.platform.startsWith("Mac");
    }
};

exports.Env = Env;