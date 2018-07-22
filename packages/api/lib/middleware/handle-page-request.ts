import * as express from 'express'
import * as fetch from 'isomorphic-fetch'
import * as LRU from 'lru-cache'

import conf from '../../../shared/lib/conf'
import {logger} from '../../../shared/lib/logger'

const log = logger('api')
const cache = LRU<string, string>({max: 10})

export const pageRoutes = ['/', '/login', '/account']

const routeFilesWithPathPrefixes = [
  {file: 'login.html', prefix: '/login'},
  {file: 'account.html', prefix: '/account'},
  {file: 'index.html', prefix: ''},
]

function injectIntoHEAD(html: string, content: string): string {
  return html.replace('<head>', `<head>${content}`)
}

function transformHTML(url: string, html: string): string {
  if (/account.html$/.test(url)) {
    return injectIntoHEAD(
      html,
      `<script>window.STRIPE_PUBLIC_KEY = "${conf.stripe.publicKey}"</script>`,
    )
  }

  return html
}

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
    const tagFileURL = `${conf.cdnAppURL}/stable.txt`
    log('attempting to resolve tag at', tagFileURL)

    const tagResponse = await fetch(tagFileURL)
    if (tagResponse.status !== 200) return next(new Error('Could not resolve tag stable'))

    const hash = (await tagResponse.text()).trim()
    const pageURL = `${conf.cdnAppURL}/${hash}/${matchingRoute.file}`
    log('fetching file at', pageURL)
    const rawFile = cache.get(pageURL) || (await (await fetch(pageURL)).text())
    cache.set(pageURL, rawFile)
    res.send(transformHTML(pageURL, rawFile))
  } catch (err) {
    next(err)
  }
}
