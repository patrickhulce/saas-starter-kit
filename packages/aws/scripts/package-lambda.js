#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const AWS_DIR = path.join(__dirname, '..')
const LAMBDA_DIR = path.join(AWS_DIR, 'dist-lambda')
const ROOT_DIR = path.join(AWS_DIR, '../..')
process.chdir(AWS_DIR)

shell.rm('-rf', LAMBDA_DIR)
console.log('building typescript...')
shell.exec('tsc')

console.log('copying over package.json files...')
shell.cp(['package.json'], 'dist-lambda/')

const dependencies = {}
for (const packageName of ['aws', 'api', 'shared']) {
  const package = require(`${ROOT_DIR}/packages/${packageName}/package.json`)
  Object.assign(dependencies, package.dependencies)
}

console.log('modifying package.json...')
const outputPackagePath = `${LAMBDA_DIR}/package.json`
const lambdaPackageJson = require(outputPackagePath)
lambdaPackageJson.dependencies = dependencies
lambdaPackageJson.devDependencies = undefined
fs.writeFileSync(outputPackagePath, JSON.stringify(lambdaPackageJson, undefined, 2))

console.log('installing production dependencies...')
shell.exec('npm install', {cwd: LAMBDA_DIR})

console.log('creating proxy entrypoint for lambda...')
const entrypoint = './dist/aws/lib/entry.js'
fs.writeFileSync(`${LAMBDA_DIR}/index.js`, `module.exports = require("${entrypoint}")`)

console.log('creating a zip...')
shell.exec(`zip -r package.zip ./*`, {cwd: LAMBDA_DIR})

console.log('done!')
