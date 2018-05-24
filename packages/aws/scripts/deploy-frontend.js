#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const ROOT_DIR = path.join(__dirname, '../../..')
const FRONTEND_DIR = path.join(ROOT_DIR, 'packages/frontend')
process.chdir(FRONTEND_DIR)

const BUCKET_PATH = process.env.BUCKET_PATH
const DEPLOY_PATH = process.env.DEPLOY_PATH
if (!BUCKET_PATH) throw new Error('Cannot deploy without bucket path')
if (!DEPLOY_PATH) throw new Error('Cannot deploy without deployment path')

const isDirty = shell.exec('git diff --quiet .').code === 1
if (isDirty) throw new Error('Cannot deploy frontend with changes')

const GIT_HASH = shell.exec('git rev-parse HEAD', {silent: true}).stdout.trim()
const [BUCKET, ...PATH_PARTS] = BUCKET_PATH.split('/').filter(Boolean)
const PATH = path.join(PATH_PARTS.join('/'), GIT_HASH)
const DESTINATION_PATH = 's3://' + path.join(BUCKET, PATH, '/')
const WEBPACK_PUBLIC_PATH = 'https://' + path.join(DEPLOY_PATH, PATH, '/')
console.log({DESTINATION_PATH, WEBPACK_PUBLIC_PATH})

console.log('building frontend...')
shell.exec('yarn clean')
shell.exec(`WEBPACK_PUBLIC_PATH=${WEBPACK_PUBLIC_PATH} yarn build`)

console.log('uploading to s3...')
shell.exec(`aws s3 cp ./dist/ ${DESTINATION_PATH} --recursive`)

