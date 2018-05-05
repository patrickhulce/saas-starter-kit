#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const debounce = require('lodash').debounce
const shell = require('shelljs')
const watch = require('watch')

const IS_WATCH = process.argv.includes('--watch')
const SKIP_WEBPACK = process.env.SKIP_WEBPACK === 'true'

const FIREBASE_DIR = path.join(__dirname, '..')
const ROOT_DIR = path.join(FIREBASE_DIR, '../..')
const FRONTEND_DIR = path.join(ROOT_DIR, 'packages/frontend')
process.chdir(FIREBASE_DIR)

if (!fs.existsSync('dist-firebase/')) shell.mkdir('dist-firebase/')

function resetAndCopyAllFiles() {
  if (!IS_WATCH && !SKIP_WEBPACK) {
    console.log('building webpack')
    shell.exec('yarn clean && yarn build', {cwd: FRONTEND_DIR})
  }

  if (fs.existsSync('dist-firebase/node_modules/')) {
    console.log('removing old node_modules folder...')
    shell.rm('dist-firebase/node_modules')
  }

  console.log('copying over public assets...')
  shell.mkdir('-p', 'dist-firebase/public')
  shell.cp('../frontend/dist/*', 'dist-firebase/public/')
  console.log('copying over firebase files...')
  shell.cp(['firebase.json', '.firebaserc', 'package.json'], 'dist-firebase/')

  console.log('creating symlink for node_modules')
  shell.ln('-s', `${ROOT_DIR}/node_modules`, `${FIREBASE_DIR}/dist-firebase/node_modules`)

  const dependencies = {}
  for (const packageName of fs.readdirSync(`${ROOT_DIR}/packages`)) {
    const package = require(`${ROOT_DIR}/packages/${packageName}/package.json`)
    Object.assign(dependencies, package.dependencies)
  }

  console.log('modifying package.json...')
  const outputPackagePath = `${FIREBASE_DIR}/dist-firebase/package.json`
  const firebasePackage = require(outputPackagePath)
  firebasePackage.dependencies = dependencies
  if (/production/.test(process.env.NODE_ENV)) {
    firebasePackage.main = firebasePackage.main.replace(/-development/, '');
  }

  fs.writeFileSync(outputPackagePath, JSON.stringify(firebasePackage, undefined, 2))
  console.log('done!')
}

resetAndCopyAllFiles()

if (IS_WATCH) {
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

  if (!SKIP_WEBPACK) {
    shell.exec('node server.js', {cwd: FRONTEND_DIR, async: true})
  }
}
