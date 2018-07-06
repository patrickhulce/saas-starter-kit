import {IDatabaseExecutor, IKiln, Kiln, SQLExtension} from 'klay'

import conf from './conf'
import {accountModel} from './models/account'
import {userModel} from './models/user'
import {verificationModel} from './models/verification'
import {IAccountInput, IUserInput, IVerificationInput, ModelID} from './typedefs'

export const kiln: IKiln = new Kiln()

kiln.addModel({name: ModelID.Account, model: accountModel})
kiln.addModel({name: ModelID.User, model: userModel})
kiln.addModel({name: ModelID.Verification, model: verificationModel})

if (!conf.database.connectionURL) throw new Error('Must provide connection URL')
export const sqlExtension = new SQLExtension(conf.database)
kiln.addExtension({extension: sqlExtension})

export const accountExecutor = kiln.build(ModelID.Account, sqlExtension) as IDatabaseExecutor<
  IAccountInput
>
export const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUserInput>
export const verificationExecutor = kiln.build(
  ModelID.Verification,
  sqlExtension,
) as IDatabaseExecutor<IVerificationInput>

export * from './models/account'
export * from './models/user'
