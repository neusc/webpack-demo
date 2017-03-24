var path = require('path')
var glob = require('glob')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    // 由于编译css文件必须由js文件导入,所以css文件被当做js文件的一部分共有同一个chunkhash值
    // 所以此处使用contenthash,编译出的js和css文件将拥有独立的hash指纹
    // 但如果css文件修改之后,还是会导致js文件的chunkhash值更新
    // 解决方案是使用webpack-md5-hash插件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin

    //多页面应用生成不同的html文件并通过chunks属性注入不同的js,css等静态文件
    new HtmlWebpackPlugin({
      filename: '../dist/demo.html',
      template: 'src/js/demo/index.html',
      inject: true,
      chunks: ['demo/index','vendor','manifest'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: '../dist/sell.html',
      template: 'src/js/sell/index.html',
      inject: true,
      chunks:['sell/index','vendor','manifest'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),


    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


/*多入口html文件注入*/
// function getHtmlEntry(globPath, pathDir) {
//   var files = glob.sync(globPath);
//   var entries = {},
//     entry, dirname, basename, pathname, extname;
//
//   for (var i = 0; i < files.length; i++) {
//     entry = files[i];
//     dirname = path.dirname(entry);
//     extname = path.extname(entry);
//     basename = path.basename(entry, extname);
//     pathname = path.join(dirname, basename);
//     pathname = pathDir ? pathname.replace(pathDir, '') : pathname;
//     console.log(2, pathname, entry);
//     entries[pathname] = './' + entry;
//   }
//   return entries;
// }
//
// var htmls = getHtmlEntry('./src/js/*/*.html', 'src\\js\\');
// var entries = {};
// for (var key in htmls) {
//   entries[key] = htmls[key].replace('.html', '.js')
//   webpackConfig.plugins.push(new HtmlWebpackPlugin({
//     filename: (key == 'index\\index' ? 'index.html' : key + '.html'),
//     template: htmls[key],
//     inject: true,
//     // chunks: [key]
//     minify: {
//       removeComments: true,
//       collapseWhitespace: true,
//       removeAttributeQuotes: true
//     },
//     chunksSortMode: 'dependency'
//   }))
// }

module.exports = webpackConfig
