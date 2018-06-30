import {json} from 'body-parser'
import * as cookies from 'cookie-parser'
import * as express from 'express'
import {
  createAndMergeRouters,
  createGrantCreationMiddleware,
  createHandleErrorMiddleware,
  createHandlePromiseMiddleware,
} from 'klay'
import {omit, pick} from 'lodash'

import {authConfiguration, conf, kiln, sqlExtension} from '../../shared/lib'

import {setPrivateCacheControl} from './middleware/cache-control'
import {handlePageRequest, pageRoutes} from './middleware/handle-page-request'
import {loggers} from './middleware/logging'
import {routerMap} from './routes'
import {_testRoutes} from './routes/_test'
import './typedefs' // tslint:disable-line

const app: express.Express = express()

app.use(json({strict: false}))
app.use(loggers)
app.use(cookies())
app.use(setPrivateCacheControl)
app.use(createGrantCreationMiddleware(authConfiguration))

app.get(pageRoutes, handlePageRequest)
app.use('/api/v1', createAndMergeRouters(kiln, routerMap).router)

if (conf.debug) {
  app.use('/_test', _testRoutes)
}

app.use(createHandlePromiseMiddleware())
app.use(createHandleErrorMiddleware())

export {app, sqlExtension}
