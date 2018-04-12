#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const ROOT_DIR = path.join(__dirname, '..')
process.chdir(ROOT_DIR)

if (fs.existsSync('dist-firebase/')) {
  shell.rm('-rf', 'dist-firebase/')
}

shell.cp('-R', 'packages/firebase/', 'dist-firebase/')
shell.rm('-rf', 'dist-firebase/node_modules/')

shell.ln('-s', `${ROOT_DIR}/node_modules`, `${ROOT_DIR}/dist-firebase/node_modules`)
shell.ln('-s', `${ROOT_DIR}/dist`, `${ROOT_DIR}/dist-firebase/dist`)

const dependencies = {}
for (const packageName of fs.readdirSync(`${ROOT_DIR}/packages`)) {
  const package = require(`${ROOT_DIR}/packages/${packageName}/package.json`)
  Object.assign(dependencies, package.dependencies)
}

const outputPackagePath = `${ROOT_DIR}/dist-firebase/package.json`
const firebasePackage = require(outputPackagePath)
firebasePackage.dependencies = dependencies
fs.writeFileSync(outputPackagePath, JSON.stringify(firebasePackage, undefined, 2))
