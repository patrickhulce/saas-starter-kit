import * as express from 'express'
import * as morgan from 'morgan'

import {conf} from '../../../shared/lib'

// tslint:disable-next-line
const debug = require('debug')('the-product:api')

export const loggers: express.RequestHandler[] = []

function logRequestBasics(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  debug(`request received: ${req.method} ${req.path}`)
  next()
}

function logRequestDetails(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const query = JSON.stringify(req.query)
  const body = JSON.stringify(req.body)
  const cookies = JSON.stringify(req.cookies)
  debug(`request received: query=${query},body=${body},cookies=${cookies}`)
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
} else {
  loggers.push(logRequestBasics)
}

if (conf.debug) {
  loggers.push(logRequestDetails)
  loggers.push(logResponse)
}
