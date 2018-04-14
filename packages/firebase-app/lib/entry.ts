import * as functions from 'firebase-functions'
process.env.NODE_ENV = 'firebase-production' // tslint:disable-line
import conf from '../../shared/lib/conf'

const overrides = functions.config()
if (overrides.sqlURL) conf.database.connectionURL = overrides.sqlURL

export * from './http'
