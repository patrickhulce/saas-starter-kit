import {IConf, JsEnvironment} from './typedefs'

const conf: IConf = {
  debug: false,
  production: false,
  isUnderTest: typeof it === 'function' || !!process.env.CI, // tslint:disable-line

  apiPathPrefix: '',

  jsEnvironment: JsEnvironment.Server,
  secret: 'super-secret-string',
  database: {
    connectionURL: 'mysql://root@localhost/the_product',
  },
}

if (process.env.NODE_ENV === 'firebase-development') {
  conf.debug = true
  conf.apiPathPrefix = '/api'
}

if (process.env.NODE_ENV === 'firebase-production') {
  conf.production = true
  conf.apiPathPrefix = '/api'
}

// tslint:disable-next-line
export default conf
