const promisify = require('util').promisify
const path = require('path')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hot = require('webpack-hot-middleware')
const express = require('express')
const proxy = require('http-proxy-middleware')
const exec = require('shelljs').exec
const killTreeNodeback = require('tree-kill')
const config = require('./webpack.config')
const killTree = promisify(killTreeNodeback)

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

if (process.env.START_API) {
  const cwd = path.join(__dirname, '../api')
  const server = exec('PORT=5000 yarn start', {cwd, async: true})

  let shutdown
  const close = exit => async () => {
    if (shutdown) return
    console.log(`Closing API server PID${server.pid}...`)
    await killTree(server.pid)
    console.log('Closed API server!')
    shutdown = true
    if (exit) process.exit(0)
  }

  // Handle all exit avenues
  // https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
  process.on('exit', close(false))
  process.on('SIGINT', close(true))
  process.on('SIGTERM', close(true))
  process.on('SIGUSR1', close(true))
  process.on('SIGUSR2', close(true))
}
