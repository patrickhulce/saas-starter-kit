import * as express from 'express'
import {CRUD_ROUTES, IDatabaseExecutor, IRouterOptions} from 'klay'
import {
  accountModel,
  AccountPlan,
  AuthRole,
  IAccount,
  IUser,
  kiln,
  modelContext,
  ModelID,
  sqlExtension,
  userModel,
} from '../../../shared/lib'
import {sendWelcomeEmail} from '../hooks/register'

const accountExecutor = kiln.build(ModelID.Account, sqlExtension) as IDatabaseExecutor<IAccount>
const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>

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
    ...CRUD_ROUTES,
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
            },
            {transaction},
          )

          await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`)
          return {account, user}
        })

        res.json(response)
      },
    },
  },
}
