var webpack = require('webpack');
var path = require('path');

module.exports = {
    debug: true,
    devtool: "source-map",
    entry: path.join(__dirname, "example", "src", "app.jsx"),
    output: {
        path: path.join(__dirname, "example", "__build__"),
        filename: "bundle.js",
        publicPath: "/__build__/"
    },
    resolve: {
        alias: {
            'fluent-flux': path.join(__dirname, "dist", "fluent-flux")
        }
    },
    module: {
        loaders: [
            { test: /\.jsx$/,    loaders: ['jsx?harmony&insertPragma=React.DOM'] },
            { test: /\.js$/,     loaders: ['es6'], exclude: [/node_modules/] }
        ]
    }
};