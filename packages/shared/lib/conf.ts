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

// tslint:disable-next-line
export default conf
