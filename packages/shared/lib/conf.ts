import {IConf, JsEnvironment} from './typedefs'

const conf: IConf = {
  debug: true,
  production: false,
  isUnderTest: typeof it === 'function' || !!process.env.CI, // tslint:disable-line

  apiPathPrefix: '',

  jsEnvironment: JsEnvironment.Server,
  secret: process.env.SECRET || 'super-secret-string',
  database: {
    connectionURL: process.env.APP_MYSQL_URL || 'mysql://root@localhost/the_product',
  },

  sparkpost: {
    sendToSink: true,
    apiKey: process.env.SPARKPOST_API_KEY || '',
    fromAddress: process.env.SPARKPOST_FROM || 'noreply@THE_DOMAIN',
  },
}

if (process.env.APP_ENV === 'firebase-development') {
  conf.apiPathPrefix = '/api'
  conf.sparkpost.sendToSink = false
}

if (process.env.APP_ENV === 'firebase-production') {
  conf.debug = false
  conf.production = true
  conf.apiPathPrefix = '/api'
  conf.sparkpost.sendToSink = false
}

// tslint:disable-next-line
export default conf
