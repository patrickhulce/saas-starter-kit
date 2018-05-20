import {IConf} from './typedefs'

const conf: IConf = {
  debug: true,
  production: false,
  isUnderTest: typeof it === 'function', // tslint:disable-line

  domain: 'THE_DOMAIN',
  origin: process.env.APP_ORIGIN || 'http://localhost',
  termsOfServiceURL: 'http://localhost/tos',
  displayName: 'THE_PRODUCT_DISPLAY_NAME',
  apiPathPrefix: '/api',

  secret: process.env.SECRET || 'unset',
  database: {
    connectionURL: process.env.APP_MYSQL_URL || '',
  },

  mailslurp: {
    apiKey: process.env.MAILSLURP_API_KEY || '',
  },

  sparkpost: {
    sendToSink: true,
    apiKey: process.env.SPARKPOST_API_KEY || '',
    fromAddress: process.env.SPARKPOST_FROM || '',
  },
}

if (process.env.APP_ENV === 'development') {
  conf.sparkpost.sendToSink = false
}

if (process.env.APP_ENV === 'firebase-development') {
  conf.sparkpost.sendToSink = false
}

if (process.env.APP_ENV === 'firebase-production') {
  conf.debug = false
  conf.production = true
  conf.sparkpost.sendToSink = false
}

if (!conf.sparkpost.fromAddress || conf.isUnderTest) {
  conf.sparkpost.fromAddress = `noreply@${conf.domain}`
}

// tslint:disable-next-line
export default conf
