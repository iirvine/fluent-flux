var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  devtool: "source-map",
  entry: {
    photos: path.join(__dirname, "example", "photos", "src", "app.jsx"),
    chat: path.join(__dirname, "example", "chat", "src", "app.jsx")
  },
  output: {
    filename: "[name].js",
    chunkFileName: "[id].chunk.js",
    path: path.join(__dirname, "example", "__build__"),
    publicPath: "/__build__/"
  },
  resolve: {
    alias: {
        'fluent-flux': path.join(__dirname, "src", "index")
    },
    modulesDirectories: ["web_modules", "node_modules", "src"],
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ],
  module: {
    loaders: [
        { test: /\.jsx$/,    loaders: ['jsx?harmony&insertPragma=React.DOM'] },
        { test: /\.js$/,     loaders: ['es6'], exclude: [/node_modules/] }
    ]
  }
};