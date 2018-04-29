import * as express from 'express'

export async function setPrivateCacheControl(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  res.setHeader('cache-control', 'private, must-revalidate')
  next()
}
