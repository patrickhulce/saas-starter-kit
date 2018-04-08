import {IConf, JsEnvironment} from './typedefs'

const conf: IConf = {
  jsEnvironment: JsEnvironment.Server,
  secret: 'super-secret-string',
  database: {
    connectionURL: 'mysql://root@localhost/the_product',
  },
}

// tslint:disable-next-line
export default conf
