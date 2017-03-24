var webpack = require('webpack');
var BabiliPlugin = require('babili-webpack-plugin');
var isProd = process.env.NODE_ENV === 'production';
var path = require('path');


console.log(isProd ? "production":"develop");
console.log("Directory : " + __dirname);
module.exports = {
  entry: path.resolve(__dirname,  'src/game.js'),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'game.min.js'
  },
  module:{
    loaders:[
      {test:/\.js$/, loader: 'babel-loader?presets[]=es2015'}
    ]
  },
  plugins: isProd ? [
    new BabiliPlugin()
  ] : []
};