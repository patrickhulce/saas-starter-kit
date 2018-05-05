#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const TOKEN = process.env.FIREBASE_TOKEN
const FIREBASE_DIR = path.join(__dirname, '../dist-firebase')
process.chdir(FIREBASE_DIR)

const firebaseArgs = TOKEN ? ` --token ${TOKEN}` : ''
shell.exec(`DEBUG=the-product:* firebase serve ${firebaseArgs}`)
