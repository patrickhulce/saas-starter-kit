import * as express from 'express'
import * as morgan from 'morgan'
import {conf} from '../../../shared/lib'

// tslint:disable-next-line
const debug = require('debug')('the-product:api')

export const loggers: express.RequestHandler[] = []

function logRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
  debug(`request received: query=${JSON.stringify(req.query)},body=${JSON.stringify(req.body)}`)
  next()
}

async function logResponse(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  res.once('finish', () => {
    if (res.body) debug(`response determined: ${JSON.stringify(res.body)}`)
  })

  next()
}

if (!conf.isUnderTest) {
  loggers.push(morgan('short'))
}

if (conf.debug) {
  loggers.push(logRequest)
  loggers.push(logResponse)
}
