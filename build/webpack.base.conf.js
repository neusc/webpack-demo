var path = require('path')
var utils = require('./utils')
var config = require('../config')
var glob = require('glob')
var vueLoaderConfig = require('./vue-loader.conf')

/**
 * 获得绝对路径
 * @method resolve
 * @param  {String} dir 相对于本文件的路径
 * @return {String}     绝对路径
 */
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

/**
 * 动态查找所有入口文件
 */
var getEntry = function () {
  var files = glob.sync('./src/js/*/index.js');
  var newEntries = {};

  files.forEach(function(f){
    var name = /js\/(.*?\/index)\.js/.exec(f)[1];//得到demo/index这样的文件名,.*?表示懒惰模式，匹配最短
    newEntries[name] = f;
  });
  console.log('入口文件为:');
  console.log(newEntries);
  console.log('\n');
  return newEntries;
};


module.exports = {
  entry: getEntry(),
  // entry: {
  //   'demo/index': './src/js/demo/index.js',
  //   'sell/index': './src/js/sell/index.js'
  // },
  output: {
    // 编译输出的静态资源根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: '[name].js',
    // 正式发布环境下编译输出的上线路径的根路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      // 例如 import Vue from 'vue'，会自动到 'vue/dist/vue.common.js'中寻找
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'image': resolve('src/image'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        // 表示预先处理
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
