var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var glob = require('glob')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

/**
 * 动态获取所有项目目录名称
 */

var getDir = function () {
  var files = glob.sync('./src/js/*/index.js');
  var directories = [];

  files.forEach(function(f){
    var name = /js\/(.*?)\/index\.js/.exec(f)[1];//得到demo这样的项目目录名,.*?表示懒惰模式，匹配最短
    directories.push(name);
  });
  console.log('当前所有项目目录数组为:');
  console.log(directories);
  console.log('\n');
  return directories;
};


// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    
    // https://github.com/ampedandwired/html-webpack-plugin
    /*
    new HtmlWebpackPlugin({
      filename: '../dist/static/view/demo/index.html',
      template: 'src/js/demo/index.html',
      inject: true,
      chunks: ['demo/index', 'vendor', 'manifest'],
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/static/view/sell/index.html',
      template: 'src/js/sell/index.html',
      inject: true,
      chunks:['sell/index','vendor','manifest'],
    }),
    */
    new FriendlyErrorsPlugin()
  ]
});

/*处理html*/
for(var dir of getDir()){
  var conf = {
    filename: '../dist/static/view/' + dir +'/index.html',
    template: 'src/js/' + dir + '/index.html',
    inject: true,
    chunks: [dir + '/index', 'vendor', 'manifest'],
  };

  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}
