#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shelljs = require('shelljs')

const DIST_DIR = path.join(__dirname, '../dist')

async function run() {
  if (!fs.existsSync(`${DIST_DIR}/api/lib/`)) shelljs.exec('npm run build')

  // Load the API to register all necessary models
  require(`${DIST_DIR}/api/lib/app`)
  // Load in the SQL extension to sync
  const sqlExtension = require(`${DIST_DIR}/shared/lib`).sqlExtension

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
