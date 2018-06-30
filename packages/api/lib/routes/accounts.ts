import * as express from 'express'
import {IDatabaseExecutor, IRouterOptions} from 'klay'

import {
  AccountPlan,
  AuthRole,
  IAccountInput,
  IUserInput,
  ModelID,
  accountModel,
  kiln,
  modelContext,
  sqlExtension,
  userModel,
} from '../../../shared/lib'
import {runRegisterHooks} from '../hooks/register-hooks'

const accountExecutor = kiln.build(ModelID.Account, sqlExtension) as IDatabaseExecutor<
  IAccountInput
>
const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUserInput>

const registerModel = modelContext.object().children({
  account: accountModel.clone().pick(['name']),
  user: userModel.clone().pick(['firstName', 'lastName', 'email', 'password']),
})

const registerResponseModel = modelContext
  .object()
  .children({account: accountModel, user: userModel})

export const accountsRouterOptions: IRouterOptions = {
  modelName: ModelID.Account,
  routes: {
    'POST /register': {
      bodyModel: registerModel,
      responseModel: registerResponseModel,
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const response = await accountExecutor.transaction(async transaction => {
          const payload = req.validated!.body
          const account = await accountExecutor.create(
            {
              name: payload.account.name,
              plan: AccountPlan.Gold,
            },
            {transaction},
          )

          const user = await userExecutor.create(
            {
              accountId: account.id!,
              email: payload.user.email,
              password: payload.user.password,
              role: AuthRole.Admin,
              firstName: payload.user.firstName,
              lastName: payload.user.lastName,
              isVerified: false,
            },
            {transaction},
          )

          await runRegisterHooks(account, user)

          user.verificationKey = undefined
          return {account, user}
        })

        res.json(response)
      },
    },
  },
}
