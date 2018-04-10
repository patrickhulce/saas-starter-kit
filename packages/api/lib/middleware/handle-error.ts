import * as express from 'express'
import {IValidationError} from 'klay'
import {pick} from 'lodash'

export function handleError(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  let status = 500
  let body

  switch (err.name) {
    case 'ValidationError':
      status = 400
      body = ((err as any) as IValidationError).toJSON()
      break
    case 'ConstraintError':
      status = 400
      body = pick(err, ['name', 'message', 'propertyPath', 'type'])
      break
    case 'AuthenticationError':
      status = 401
      break
    case 'AuthorizationError':
      status = 403
      body = {roles: req.grants!.roles, grants: Array.from((req.grants as any)._grants)}
      break
    default:
      body = {message: err.message, stack: err.stack!.split('\n').slice(0, 5)}
  }

  res.status(status)
  if (body) {
    res.body = body
    res.json(body)
  }

  res.end()
}
