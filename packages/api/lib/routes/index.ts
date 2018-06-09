import {IRouterMap} from 'klay'

import {accountsRouterOptions} from './accounts'
import {oauthRouterOptions} from './oauth'
import {usersRouterOptions} from './users'

export const routerMap: IRouterMap = {
  '/oauth': oauthRouterOptions,
  '/accounts': accountsRouterOptions,
  '/users': usersRouterOptions,
}
