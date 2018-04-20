const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractCssPlugin = require('mini-css-extract-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const cssLoader = [
  {
    loader: 'typings-for-css-modules-loader',
    options: {modules: true, namedExport: true, camelCase: true, sourceMap: true},
  },
  {
    loader: 'sass-loader',
    options: {sourceMap: true},
  },
]

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    login: `${__dirname}/src/login.ts`,
  },
  output: {
    path: `${__dirname}/dist`,
    filename: `[name].[chunkhash].js`,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [__dirname, 'node_modules'],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^firebase$/, `${__dirname}/shims/firebase.js`),
    new webpack.NormalModuleReplacementPlugin(/^firebaseui$/, `${__dirname}/shims/firebaseui.js`),
    new HtmlWebpackPlugin({
      chunks: ['login'],
      filename: 'login.html',
      template: `${__dirname}/src/login.html`,
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: /inline\./,
      defaultAttribute: 'defer',
    }),
  ],
  module: {
    rules: [
      {test: /\.tsx?$/, use: ['awesome-typescript-loader'], include: `${__dirname}/src`},
      {test: /\.scss$/, use: ['style-loader', ...cssLoader], include: `${__dirname}/src`},
    ],
  },
}

if (process.env.NODE_ENV === 'production') {
  const config = module.exports

  Object.assign(config, {
    mode: 'production',
    devtool: 'source-map',
  })

  config.plugins = [
    ...config.plugins,
    new ExtractCssPlugin({
      filename: `[name].[chunkhash].css`,
    }),
  ]

  config.module.rules[1].use = [
    ExtractCssPlugin.loader,
    ...cssLoader,
  ]
}
