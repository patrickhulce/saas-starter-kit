const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const express = require('express')
const proxy = require('http-proxy-middleware')
const config = require('./webpack.config')

const app = express()
const compiler = webpack(config)

app.use('/__', proxy({target: 'http://localhost:5000/'}))
app.use('/api', proxy({target: 'http://localhost:5000/'}))
app.use(middleware(compiler, {}))
// eslint-disable-next-line no-console
app.listen(8080, () => console.log('listening on port 8080'))
