import {
  IKiln,
  Kiln,
  RouteExtension,
  RouterExtension,
  SQLExtension,
} from 'klay'

import conf from './conf'
import {accountModel} from './models/account'
import {userModel} from './models/user'
import {ModelID} from './typedefs'

export const kiln: IKiln = new Kiln()

kiln.addModel({name: ModelID.Account, model: accountModel})
kiln.addModel({name: ModelID.User, model: userModel, meta: {tableName: 'example_users'}})

export const sqlExtension = new SQLExtension(conf.database)
kiln.addExtension({extension: sqlExtension})

const routeExtension = new RouteExtension({})
kiln.addExtension({extension: routeExtension})

const routerExtension = new RouterExtension({})
kiln.addExtension({extension: routerExtension})

export * from './models/account'
export * from './models/user'
