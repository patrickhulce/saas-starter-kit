const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hot = require('webpack-hot-middleware')
const express = require('express')
const proxy = require('http-proxy-middleware')
const shell = require('shelljs')
const config = require('./webpack.config')

const app = express()
const compiler = webpack(config)

app.use('/__', proxy({target: 'http://localhost:5000/'}))
app.use('/api', proxy({target: 'http://localhost:5000/', changeOrigin: true}))
app.get('/login', (req, res) => res.redirect('/login.html'))
app.use(middleware(compiler, {}))
app.use(hot(compiler))

const server = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line no-console
  console.log(`webpackdev listening on ${server.address().port}`)
})

if (process.env.START_FIREBASE) {
  shell.exec('SKIP_WEBPACK=true yarn start', {cwd: '../firebase-app', async: true})
}
