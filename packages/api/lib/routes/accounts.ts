import * as express from 'express'
import {ActionType, IDatabaseExecutor, IRouterOptions} from 'klay'
import {values} from 'lodash'

import {
  AccountPlan,
  AuthRole,
  IAccount,
  IAccountInput,
  IUser,
  IUserInput,
  ModelID,
  Permission,
  accountModel,
  kiln,
  logger,
  modelContext,
  sqlExtension,
  userModel,
} from '../../../shared/lib'
import {runRegisterHooks} from '../hooks/register-hooks'
import {createOrUpdateStripe} from '../stripe'

// tslint:disable-next-line
const log = logger('api:accounts')

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
    'GET /:id': ActionType.Read,
    'POST /register': {
      bodyModel: registerModel,
      responseModel: registerResponseModel,
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const response = await accountExecutor.transaction(async transaction => {
          const payload = req.validated!.body
          log('creating account', payload.account.name)
          const account = (await accountExecutor.create(
            {
              name: payload.account.name,
              plan: AccountPlan.Free,
              stripeId: null,
            },
            {transaction},
          )) as IAccount

          log('creating user', payload.user.email)
          const user = (await userExecutor.create(
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
          )) as IUser

          log('running register hooks', user.email)
          await runRegisterHooks(account, user, transaction)

          return {account, user}
        })

        res.json(response)
      },
    },
    'PUT /:id/payment-method': {
      bodyModel: modelContext.object().children({
        stripeSourceId: modelContext.string(),
        plan: modelContext.string().enum(values(AccountPlan)),
      }),
      authorization: {
        permission: Permission.AccountManage,
        getAffectedCriteriaValues(req: express.Request): number[] {
          return [Number(req.params.id)]
        },
      },
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const user = req.grants!.userContext! as IUser
        log('updating account', user.accountId, 'to', req.body.plan)
        await createOrUpdateStripe(user, req.body.plan, req.body.stripeSourceId)
        res.sendStatus(204)
      },
    },
  },
}
