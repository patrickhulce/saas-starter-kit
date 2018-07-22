const path = require('path')
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
    app: [`${__dirname}/src/app/entry.tsx`],
    login: [`${__dirname}/src/login/entry.tsx`],
    account: [`${__dirname}/src/account/entry.tsx`],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: `[name].[hash].js`,
    publicPath: process.env.WEBPACK_PUBLIC_PATH || '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [__dirname, 'node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify('frontend'),
      'process.env.APP_SECRET': JSON.stringify('NONE'),
      'process.env.APP_MYSQL_URL': JSON.stringify('NONE'),
      'process.env.MAILSLURP_API_KEY': JSON.stringify('NONE'),
      'process.env.SPARKPOST_API_KEY': JSON.stringify('NONE'),
      'process.env.STRIPE_SECRET_KEY': JSON.stringify('NONE'),
      'process.env.STRIPE_PUBLIC_KEY': JSON.stringify(process.env.STRIPE_PUBLIC_KEY),
    }),
    new HtmlWebpackPlugin({
      chunks: ['login'],
      filename: 'login.html',
      template: `${__dirname}/src/assets/page.html`,
    }),
    new HtmlWebpackPlugin({
      chunks: ['account'],
      filename: 'account.html',
      template: `${__dirname}/src/assets/page.html`,
    }),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      filename: 'index.html',
      template: `${__dirname}/src/assets/page.html`,
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: 'inline.',
      defaultAttribute: 'defer',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader'],
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, '../shared')],
      },
      {test: /\.scss$/, use: ['style-loader', ...cssLoader], include: `${__dirname}/src`},
      {test: /\.(jpg|png|svg)$/, use: 'file-loader'},
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

  config.module.rules[1].use = [ExtractCssPlugin.loader, ...cssLoader]
} else {
  for (const files of Object.values(config.entry)) {
    files.unshift('webpack-hot-middleware/client')
  }

  config.plugins = [...config.plugins, new webpack.HotModuleReplacementPlugin()]
}
