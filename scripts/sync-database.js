#!/usr/bin/env node

const fs = require('fs')
const shelljs = require('shelljs')

const FIREBASE_DIST = 'packages/firebase-app/dist-firebase/dist'

async function run() {
  if (!fs.existsSync(`${FIREBASE_DIST}/api/lib/`)) shelljs.exec('npm run build')

  // Load the API to register all necessary models
  require(`../${FIREBASE_DIST}/api/lib/app`)
  // Load in the SQL extension to sync
  const sqlExtension = require(`../${FIREBASE_DIST}/shared/lib`).sqlExtension

  console.log('Syncing database...')
  await sqlExtension.sequelize.sync({force: true})
  console.log('Closing connection...')
  await sqlExtension.sequelize.close()
  console.log('Done')
}


run().catch(err => {
  console.error(err)
  process.exit(1)
})
