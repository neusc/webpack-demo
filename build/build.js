// https://github.com/shelljs/shelljs
// 生产环境的入口文件
// 该文件，为构建打包文件，会将源码进行构建（编译、压缩等）后打包。
require('./check-versions')()

// 设置当前环境为生产环境
process.env.NODE_ENV = 'production'

var ora = require('ora')
var path = require('path')
// 在终端输出带颜色的文字
var chalk = require('chalk')
// 可以实现Unix的shell命令的nodejs API
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

// 在终端显示loading效果，并输出提示
var spinner = ora('building for production...')
spinner.start()

// 删除这个文件夹 （递归删除）
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.config.silent = false

// 构建
webpack(webpackConfig, function (err, stats) {
  // 构建成功，停止动画
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  // 打印提示
  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})
