#!/usr/bin/env node

const path = require('path')
const shell = require('shelljs')

const ROOT_DIR = path.join(__dirname, '../../..')
const AWS_DIR = path.join(__dirname, '../')

if (
  !process.env.DEPLOY_MYSQL_URL ||
  !process.env.DEPLOY_APP_LAMBDA_FN ||
  !process.env.DEPLOY_APP_BUCKET_PATH
) {
  throw new Error('Must define SQL URL, lambda name, and bucket')
}

process.chdir(ROOT_DIR)
console.log('-------- START SQL SERVER MIGRATION --------')
shell.exec(`yarn migrate --url ${process.env.DEPLOY_MYSQL_URL}`)

process.chdir(AWS_DIR)
console.log('-------- START LAMBDA DEPLOYMENT --------')
shell.exec(`./scripts/deploy-lambda.js ${process.env.DEPLOY_APP_LAMBDA_FN}`)

console.log('-------- START FRONTEND DEPLOYMENT --------')
shell.exec(`./scripts/deploy-frontend.js ${process.env.DEPLOY_APP_BUCKET_PATH}`)
