var webpack = require('webpack');
var BabiliPlugin = require('babili-webpack-plugin');
var isProd = process.env.NODE_ENV === 'production';


console.log(isProd ? "production":"develop");
module.exports = {
  entry: './src/game.js',
  output: {
    path: __dirname + "/dist",
    filename: 'game.min.js'
  },
  plugins: isProd ? [
    new BabiliPlugin()
  ] : []
};