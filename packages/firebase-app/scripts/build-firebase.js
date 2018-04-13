#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const debounce = require('lodash').debounce
const shell = require('shelljs')
const watch = require('watch')

const FIREBASE_DIR = path.join(__dirname, '..')
const ROOT_DIR = path.join(FIREBASE_DIR, '../..')
process.chdir(FIREBASE_DIR)

if (!fs.existsSync('dist-firebase/')) shell.mkdir('dist-firebase/')

function resetAndCopyAllFiles() {
  if (fs.existsSync('dist-firebase/public/')) {
    console.log('removing public files...')
    shell.rm('-rf', 'dist-firebase/public/')
  }

  if (fs.existsSync('dist-firebase/node_modules/')) {
    console.log('removing old node_modules folder...')
    shell.rm('dist-firebase/node_modules')
  }

  console.log('copying over public folder...')
  shell.cp('-rf', 'public/', 'dist-firebase/')
  console.log('copying over firebase files...')
  shell.cp(['firebase.json', '.firebaserc', 'package.json'], 'dist-firebase/')

  console.log('creating symlink for node_modules')
  shell.ln('-s', `${ROOT_DIR}/node_modules`, `${FIREBASE_DIR}/dist-firebase/node_modules`)

  const dependencies = {}
  for (const packageName of fs.readdirSync(`${ROOT_DIR}/packages`)) {
    const package = require(`${ROOT_DIR}/packages/${packageName}/package.json`)
    Object.assign(dependencies, package.dependencies)
  }

  console.log('coalescing all package.json dependencies...')
  const outputPackagePath = `${FIREBASE_DIR}/dist-firebase/package.json`
  const firebasePackage = require(outputPackagePath)
  firebasePackage.dependencies = dependencies
  fs.writeFileSync(outputPackagePath, JSON.stringify(firebasePackage, undefined, 2))
  console.log('done!')
}

resetAndCopyAllFiles()

if (process.argv.includes('--watch')) {
  function filter(file) {
    return !['dist-firebase', 'node_modules'].includes(path.basename(file))
  }

  const debouncedReset = debounce(resetAndCopyAllFiles, 500)
  watch.watchTree(FIREBASE_DIR, {filter}, (stats, prev, next) => {
    if (typeof stats === 'object' && !prev && !next) {
      console.log('\n\n')
      console.log('watching tree for changes...\n\n')
    } else {
      debouncedReset();
    }
  })
}
