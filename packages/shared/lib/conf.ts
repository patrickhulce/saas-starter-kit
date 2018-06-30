import {IConf} from './typedefs'

const conf: IConf = {
  debug: true,
  production: false,
  isUnderTest: typeof it === 'function', // tslint:disable-line

  origin: process.env.APP_ORIGIN || 'http://localhost',
  cdnAppURL: process.env.APP_CDN_URL || 'https://cdn.the-product.com/app/',
  termsOfServiceURL: 'http://localhost/tos',
  displayName: 'THE_PRODUCT_DISPLAY_NAME',

  secret: process.env.APP_SECRET || 'unset',
  database: {
    connectionURL: process.env.APP_MYSQL_URL || '',
  },

  mailslurp: {
    apiKey: process.env.MAILSLURP_API_KEY || '',
  },

  sparkpost: {
    sendToTestMailboxOnly: true,
    apiKey: process.env.SPARKPOST_API_KEY || '',
    fromAddress: process.env.SPARKPOST_FROM || '',
  },
}

if (process.env.APP_ENV === 'aws-development') {
  conf.sparkpost.sendToTestMailboxOnly = false
}

if (process.env.APP_ENV === 'aws-production') {
  conf.debug = false
  conf.production = true
  conf.sparkpost.sendToTestMailboxOnly = false
}

if (!conf.sparkpost.fromAddress || conf.isUnderTest) {
  conf.sparkpost.fromAddress = `noreply@THE_DOMAIN`
}

// tslint:disable-next-line
export default conf
