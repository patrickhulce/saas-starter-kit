import conf from './conf'

// tslint:disable-next-line
const debug = require('debug')

export interface ILogger {
  verbose(...args: any[]): void
  (...args: any[]): void
}

export type LoggerScope = 'api' | 'email' | 'hooks' | 'api:accounts' | 'api:users'

export function logger(scope: LoggerScope): ILogger {
  if (conf.isUnderTest && process.env.DEBUG) {
    // @ts-ignore
    const log: ILogger = () => console.log.call(console, scope, ...arguments)
    const verbose = () => console.log.call(console, 'VERBOSE', scope, ...arguments)
    log.verbose = verbose
    return log
  } else {
    const log = debug(`the-product:${scope}`)
    const verbose = debug(`the-product:verbose:${scope}`)
    log.verbose = verbose
    return log
  }
}
