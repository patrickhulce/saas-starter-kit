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
    login: [`${__dirname}/src/login.tsx`],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: `[name].[hash].js`,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [__dirname, 'node_modules'],
  },
  plugins: [
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

const config = module.exports
if (process.env.NODE_ENV === 'production') {
  Object.assign(config, {
    mode: 'production',
    devtool: 'source-map',
  })

  config.plugins = [
    ...config.plugins,
    new ExtractCssPlugin({
      filename: `[name].[hash].css`,
    }),
  ]

  config.module.rules[1].use = [
    ExtractCssPlugin.loader,
    ...cssLoader,
  ]
} else {
  for (const files of Object.values(config.entry)) {
    files.push('webpack-hot-middleware/client')
  }

  config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ]
}
