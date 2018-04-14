#!/usr/bin/env node

const path = require('path')
const shell = require('shelljs')

shell.exec('NODE_ENV=firebase-production npm run build')
process.chdir(path.join(__dirname, '../dist-firebase'))
shell.exec('firebase deploy')
