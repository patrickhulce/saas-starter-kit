import * as functions from 'firebase-functions'
/* tslint:disable */
const overrides = functions.config()
process.env.APP_ENV = 'firebase-production'
process.env.SECRET = overrides.crypto.secret
process.env.APP_MYSQL_URL = overrides.mysql.url
process.env.SPARKPOST_API_KEY = overrides.email.sparkpost
process.env.SPARKPOST_FROM = overrides.email.from
import conf from '../../shared/lib/conf'
export * from './http'
