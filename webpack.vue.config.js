const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const NpmInstallPlugin = require('npm-install-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const PATHS = {
  app: path.join(__dirname, 'src/vue'),
  build: path.join(__dirname, '_vue'),
  publicPath: '//o7mw3gkkh.qnssl.com/_vue/'
}

const config = {
  stats: { children: false },
  entry: {
    app: PATHS.app,
    vendor: [
      // vue
      'vue',
      'vue-router'
    ]
  },
  output: {
    path: PATHS.build,
    publicPath: isProd ? PATHS.publicPath : '',
    filename: 'bundle.js'
  },

  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\/|app/,
        loader: 'babel?cacheDirectory'
      }
    ]
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract('css'),
      stylus: ExtractTextPlugin.extract('css!stylus')
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      favicon: './assets/images/vue.png', // favicon路径，通过webpack引入同时可以生成hash值
      filename: './index.html', // 生成的html存放路径，相对于path
      template: './src/vue/index.template', // html模板路径
      inject: 'body', // js插入的位置，true/'head'/'body'/false
      hash: !!isProd, // 为静态资源生成hash值
      chunks: ['vendor', 'app'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    })
  ]
}

if (isProd) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  )
} else {
  config.devtool = 'source-map'
  config.devServer = {
    contentBase: PATHS.build,
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only',
    port: 8081
  }
  config.plugins.push(
    new NpmInstallPlugin({ saveDev: true }),
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = config