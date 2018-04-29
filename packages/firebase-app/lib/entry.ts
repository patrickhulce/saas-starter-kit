import * as functions from 'firebase-functions'
process.env.NODE_ENV = 'firebase-production' // tslint:disable-line
import conf from '../../shared/lib/conf'

const overrides = functions.config()
if (overrides.mysql) conf.database.connectionURL = overrides.mysql.url

if (overrides.email) {
  conf.sparkpost.apiKey = overrides.email.sparkpost
  conf.sparkpost.fromAddress = overrides.email.from
}

export * from './http'
