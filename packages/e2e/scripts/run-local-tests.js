#!/usr/bin/env node

const path = require('path')
const childProcess = require('child_process')

const DEVSERVER_OUT = []
const E2E_DIR = path.join(__dirname, '../')
const FIREBASE_DIR = path.join(E2E_DIR, '../firebase-app')
const DEVSERVER_PATTERN = /webpackdev listening on (\d+)/

function waitForPatternInOutput(pattern, interval = 250) {
  const logWaiting = () => console.log(`Waiting for "${pattern.source}"...`)

  logWaiting()
  return new Promise(resolve => {
    let i = setInterval(() => {
      if (DEVSERVER_OUT.some(line => pattern.test(line))) {
        clearInterval(i)
        resolve()
      }

      logWaiting()
    }, interval)
  })
}

async function run() {
  const serverProc = childProcess.exec('PORT=0 npm start', {cwd: FIREBASE_DIR})
  serverProc.stdout.on('data', buf => DEVSERVER_OUT.push(buf.toString()))

  await waitForPatternInOutput(/webpack built [a-f0-9]+ in \d+ms/, 1000)
  await waitForPatternInOutput(/Parsing function triggers/)
  await waitForPatternInOutput(DEVSERVER_PATTERN)

  const port = Number(DEVSERVER_OUT.find(l => DEVSERVER_PATTERN.test(l)).match(DEVSERVER_PATTERN)[1])

  console.log(`Ready for testing! Will run on port ${port}`)

  try {
    childProcess.execSync(`PORT=${port} npm run test:unit`, {stdio: 'inherit', cwd: E2E_DIR})
  } catch (err) {
    console.error('Error occurred', err.stack)
  } finally {
    serverProc.kill()
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
