#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const BUCKET_PATH = process.argv[2]
const TARGET_TAG = process.argv[3]
const HASH_TO_PROMOTE = process.argv[4]
if (process.argv.length !== 5) throw new Error('Usage $0: <bucket path> <tag> <hash>')

const DESTINATION_PATH = 's3://' + path.join(BUCKET_PATH, `${TARGET_TAG}.txt`)
console.log({DESTINATION_PATH, HASH_TO_PROMOTE})

console.log('creating text file...')
const TMP_FILENAME = 'hash.tmp'
fs.writeFileSync(TMP_FILENAME, HASH_TO_PROMOTE)

try {
  console.log('uploading to s3...')
  shell.exec(`aws s3 cp ${TMP_FILENAME} ${DESTINATION_PATH}`)
} finally {
  fs.unlinkSync(TMP_FILENAME)
}

