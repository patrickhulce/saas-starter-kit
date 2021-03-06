#!/usr/bin/env node

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const shelljs = require('shelljs')
shelljs.config.fatal = true

const KLAY_EXECUTABLE = path.join(__dirname, '../node_modules/.bin/klay-kiln-sql')
const PRETTIER_EXECUTABLE = path.join(__dirname, '../node_modules/.bin/prettier')

const MIGRATION_FOLDER = path.join(__dirname, '../migrations')
const DIST_DIR = path.join(__dirname, '../dist')
const KILN_FILE = path.join(DIST_DIR, 'shared/lib/kiln.js')

async function run() {
  const filesBefore = fs.readdirSync(MIGRATION_FOLDER)
  shelljs.exec(`${KLAY_EXECUTABLE} migration:bootstrap -k ${KILN_FILE}`)
  const filesAfter = fs.readdirSync(MIGRATION_FOLDER)

  const bootstrapFile = path.join(MIGRATION_FOLDER, filesBefore.find(f => /bootstrap.js$/.test(f)))
  const createdFile = path.join(MIGRATION_FOLDER, _.difference(filesAfter, filesBefore)[0])
  shelljs.exec(`${PRETTIER_EXECUTABLE} --write ${createdFile}`, {silent: true})
  shelljs.mv(createdFile, bootstrapFile)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
