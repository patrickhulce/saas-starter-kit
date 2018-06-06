#!/usr/bin/env node

const path = require('path')
const shell = require('shelljs')
shell.config.fatal = true

const ROOT_DIR = path.join(__dirname, '../../..')
const AWS_DIR = path.join(__dirname, '../')
const FRONTEND_DIR = path.join(ROOT_DIR, 'packages/frontend')
process.chdir(FRONTEND_DIR)

const BUCKET_PATH = process.argv[2]
let DEPLOY_PATH = process.argv[3]
if (process.argv.length < 3) throw new Error('Usage $0: <bucket path> [<deploy path>]')

shell.exec('git diff --quiet .')

const GIT_HASH = shell.exec('git rev-parse HEAD', {silent: true}).stdout.trim()
const [BUCKET, ...PATH_PARTS] = BUCKET_PATH.split('/').filter(Boolean)
const PATH = path.join(PATH_PARTS.join('/'), GIT_HASH)
if (!DEPLOY_PATH) DEPLOY_PATH = BUCKET

const DESTINATION_PATH = 's3://' + path.join(BUCKET, PATH, '/')
const WEBPACK_PUBLIC_PATH = 'https://' + path.join(DEPLOY_PATH, PATH, '/')
console.log({DESTINATION_PATH, WEBPACK_PUBLIC_PATH})

console.log('building frontend...')
shell.exec('yarn clean')
shell.exec(`WEBPACK_PUBLIC_PATH=${WEBPACK_PUBLIC_PATH} yarn build`)

console.log('uploading to s3...')
shell.exec(`aws s3 cp ./dist/ ${DESTINATION_PATH} --recursive`)

if (!process.env.SKIP_PROMOTE) {
  process.chdir(AWS_DIR)
  const GIT_BRANCH = shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).stdout.trim()
  const TAG = `branch-${GIT_BRANCH}`
  shell.exec(`./scripts/promote-frontend.js ${BUCKET_PATH} ${TAG} ${GIT_HASH}`)
}
