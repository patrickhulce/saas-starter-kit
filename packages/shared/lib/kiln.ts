import {
  IKiln,
  Kiln,
  SQLExtension,
} from 'klay'

import conf from './conf'
import {accountModel} from './models/account'
import {userModel} from './models/user'
import {ModelID} from './typedefs'

export const kiln: IKiln = new Kiln()

kiln.addModel({name: ModelID.Account, model: accountModel})
kiln.addModel({name: ModelID.User, model: userModel})

export const sqlExtension = new SQLExtension(conf.database)
kiln.addExtension({extension: sqlExtension})

export * from './models/account'
export * from './models/user'
