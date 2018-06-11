const path = require("path");

module.exports = {
    cache: true,
    // devtool: "eval",
    entry: ["babel-polyfill", "./src/editor/loader.jsx"],
    output: {
        path: `${__dirname}/dist/js`,
        filename: "loader.js"
    },
    performance: {
        hints: false, // enum
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['env', 'stage-0', "react"],
                }

            },
        ],
    },
    resolve: {
        // root: __dirname + "/src/js",
        extensions: ['.js', '.jsx'],
        alias: {
            "react": path.resolve(__dirname, 'src/build/webpack-alias/webpack-alias-react.js'),
            "react-dom": path.resolve(__dirname, 'src/build/webpack-alias/webpack-alias-react-dom.js'),
            "react-router": path.resolve(__dirname, 'src/build/webpack-alias/webpack-alias-react-router.js'),
            "react-router-dom": path.resolve(__dirname, 'src/build/webpack-alias/webpack-alias-react-router-dom.js'),
        },
    },
};

