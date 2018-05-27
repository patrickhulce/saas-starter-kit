#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const AWS_DIR = path.join(__dirname, '..')
const LAMBDA_DIR = path.join(AWS_DIR, 'dist-lambda')
const ROOT_DIR = path.join(AWS_DIR, '../..')
process.chdir(AWS_DIR)

const LAMBDA_FN_NAME = process.argv[2]
if (process.argv.length !== 3) throw new Error('Usage $0: <lambda fn name>')

console.log('package lambda code to zip file...')
shell.exec('./scripts/package-lambda.js')

const ZIP_FILE_PATH = 'fileb://dist-lambda/package.zip'
const ARGS = `--function-name ${LAMBDA_FN_NAME} --zip-file ${ZIP_FILE_PATH}`
console.log('uploading to s3...')
const output = shell.exec(`aws lambda update-function-code ${ARGS}`, {silent: true})
const {RevisionId, CodeSha256, FunctionArn, Version} = JSON.parse(output.stdout)
console.log({RevisionId, CodeSha256, FunctionArn, Version})

