import * as express from 'express'
import {CRUD_ROUTES, IDatabaseExecutor, IRouterOptions} from 'klay'
import {
  accountModel,
  AccountPlan,
  AuthRole,
  IAccount,
  IUser,
  kiln,
  ModelID,
  sqlExtension,
  userModel,
} from '../../../shared/lib'

const accountExecutor = kiln.build(ModelID.Account, sqlExtension) as IDatabaseExecutor<IAccount>
const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>

export const accountsRouterOptions: IRouterOptions = {
  modelName: ModelID.Account,
  routes: {
    ...CRUD_ROUTES,
    'POST /signup': {
      bodyModel: accountModel
        .clone()
        .pick(['name', 'slug'])
        .merge(userModel.clone().pick(['firstName', 'lastName', 'email', 'password'])),
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const response = await accountExecutor.transaction(async transaction => {
          const payload = req.validated!.body
          const account = await accountExecutor.create(
            {
              name: payload.name,
              slug: payload.slug,
              plan: AccountPlan.Gold,
            },
            {transaction},
          )

          const user = await userExecutor.create(
            {
              accountId: account.id!,
              email: payload.email,
              password: payload.password,
              role: AuthRole.Admin,
              firstName: payload.firstName,
              lastName: payload.lastName,
            },
            {transaction},
          )

          return {account, user}
        })

        res.json(response)
      },
    },
  },
}
