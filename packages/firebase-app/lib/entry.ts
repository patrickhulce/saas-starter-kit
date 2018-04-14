import * as functions from 'firebase-functions'
process.env.NODE_ENV = 'firebase-production' // tslint:disable-line
import conf from '../../shared/lib/conf'

const overrides = functions.config()
if (overrides.mysql) conf.database.connectionURL = overrides.mysql.url

export * from './http'
