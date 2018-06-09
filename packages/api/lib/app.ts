import {json} from 'body-parser'
import * as cookies from 'cookie-parser'
import * as express from 'express'
import {createAndMergeRouters, createGrantCreationMiddleware} from 'klay'
import {omit, pick} from 'lodash'

import {authConfiguration, kiln, sqlExtension} from '../../shared/lib'

import {setPrivateCacheControl} from './middleware/cache-control'
import {handleError} from './middleware/handle-error'
import {handlePageRequest, pageRoutes} from './middleware/handle-page-request'
import {handlePromise} from './middleware/handle-promise'
import {loggers} from './middleware/logging'
import {routerMap} from './routes'
import './typedefs' // tslint:disable-line

const app: express.Express = express()

app.use(json({strict: false}))
app.use(loggers)
app.use(cookies())
app.use(setPrivateCacheControl)
app.use(createGrantCreationMiddleware(authConfiguration))

app.get(pageRoutes, handlePageRequest)
app.use('/api/v1', createAndMergeRouters(kiln, routerMap).router)

app.use(handlePromise)
app.use(handleError)

export {app, sqlExtension}
