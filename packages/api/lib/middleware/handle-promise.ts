import * as express from 'express'

export async function handlePromise(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  if (!res.promise) return next()

  try {
    const result = await res.promise

    if (typeof result === 'undefined') {
      res.status(204)
      res.end()
    } else {
      res.body = result
      res.json(result)
    }
  } catch (err) {
    next(err)
  }
}
