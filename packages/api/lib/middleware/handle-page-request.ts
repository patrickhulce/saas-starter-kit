import {join} from 'path'
import * as express from 'express'
import * as request from 'request'
import * as fetch from 'isomorphic-fetch'
import conf from '../../../shared/lib/conf'

const debug = require('debug')('the-product:api') // tslint-disable-line

export const pageRoutes = [
  '/',
  '/login',
]

const routeFilesWithPathPrefixes = [
  {file: 'login.html', prefix: '/login'},
  {file: 'index.html', prefix: ''},
]

export async function handlePageRequest(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  // Find the HTML file we should be serving
  const matchingRoute = routeFilesWithPathPrefixes.find(entry => req.path.startsWith(entry.prefix))
  if (!matchingRoute) return next(new Error('Could not find matching HTML file'))

  // Check that user is logged in if they're fetching anything other than the login page
  const isUserLoggedIn = !!req.grants && !!req.grants.userContext
  // TODO: add redirectTo functionality
  if (!isUserLoggedIn && matchingRoute.prefix !== '/login') return res.redirect('/login')

  try {
    // TODO: support tags other than stable
    const tagFileURL = join(conf.cdnAppURL, 'stable.txt').replace(':/', '://')
    debug('attempting to resolve tag at', tagFileURL)

    const tagResponse = await fetch(tagFileURL)
    if (tagResponse.status !== 200) return next(new Error('Could not resolve tag stable'))

    const hash = (await tagResponse.text()).trim()
    const pageURL = join(conf.cdnAppURL, hash, matchingRoute.file).replace(':/', '://')
    debug('piping response for', pageURL)

    request.get(pageURL).pipe(res)
  } catch (err) {
    next(err)
  }
}
