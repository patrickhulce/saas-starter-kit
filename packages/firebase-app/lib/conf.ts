import * as functions from 'firebase-functions'
import {IConf} from '../../shared/lib/typedefs'
import conf from '../../shared/lib/conf'

conf.production = !!functions.config().production
conf.apiPathPrefix = '/api'
conf.database.connectionURL = functions.config().sqlURL

export default conf
