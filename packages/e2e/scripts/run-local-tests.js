#!/usr/bin/env node

const path = require('path')
const childProcess = require('child_process')

const DEVSERVER_OUT = []
const E2E_DIR = path.join(__dirname, '../')
const FRONTEND_DIR = path.join(E2E_DIR, '../frontend')
const DEVSERVER_PATTERN = /webpackdev listening on (\d+)/

function waitForPatternInOutput(pattern, interval = 500) {
  const logWaiting = () => console.log(`Waiting for "${pattern.source}"...`)

  logWaiting()
  return new Promise((resolve, reject) => {
    let errTimeout = setTimeout(() => {
      console.error(DEVSERVER_OUT.join('\n'))
      reject(new Error('Timeout reached'))
    }, 30 * 1000)
    let i = setInterval(() => {
      if (DEVSERVER_OUT.some(line => pattern.test(line))) {
        clearInterval(i)
        clearTimeout(errTimeout)
        resolve()
      }

      logWaiting()
    }, interval)
  })
}

async function run() {
  const serverProc = childProcess.exec('PORT=0 npm start', {cwd: FRONTEND_DIR})
  serverProc.stdout.on('data', buf => DEVSERVER_OUT.push(buf.toString()))

  await waitForPatternInOutput(DEVSERVER_PATTERN)
  await waitForPatternInOutput(/Starting compilation/, 2000)
  await waitForPatternInOutput(/webpack built [a-f0-9]+ in \d+ms/, 3000)
  await waitForPatternInOutput(/API is available/, 1000)

  const port = Number(DEVSERVER_OUT.find(l => DEVSERVER_PATTERN.test(l)).match(DEVSERVER_PATTERN)[1])

  console.log(`Ready for testing! Will run on port ${port}`)

  let success
  try {
    childProcess.execSync(`PORT=${port} npm run test:unit`, {stdio: 'inherit', cwd: E2E_DIR})
    success = true
  } catch (err) {
    success = false
    console.error('Error occurred', err.stack)
  }

  try {
    process.kill(-serverProc.pid)
  } catch (e) {}
  process.exit(success ? 0 : 1)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
