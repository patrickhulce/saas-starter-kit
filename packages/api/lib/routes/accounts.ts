import * as express from 'express'
import * as firebase from 'firebase-admin'
import {assert, CRUD_ROUTES, IDatabaseExecutor, IRouterOptions} from 'klay'
import {
  AccountPlan,
  AuthRole,
  IAccount,
  IUser,
  kiln,
  modelContext,
  ModelID,
  sqlExtension,
} from '../../../shared/lib'

const accountExecutor = kiln.build(ModelID.Account, sqlExtension) as IDatabaseExecutor<IAccount>
const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>

const registerModel = modelContext
  .object()
  .children({
    name: modelContext.string().max(80),
    userDisplayName: modelContext.string().optional(),
    email: modelContext.email(),
    password: modelContext
      .string()
      .min(8)
      .max(40)
      .optional(),
  })

export const accountsRouterOptions: IRouterOptions = {
  modelName: ModelID.Account,
  routes: {
    ...CRUD_ROUTES,
    'POST /register': {
      bodyModel: registerModel,
      async handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ): Promise<void> {
        const payload = req.validated!.body

        let firebaseUser: firebase.auth.UserRecord | undefined
        try {
          firebaseUser = await firebase.auth().getUserByEmail(payload.email)
        } catch (err) {
          // Ignore firebase error, user might not exist
        }

        if (!firebaseUser) {
          assert.ok(payload.password, 'password required for new user')
          firebaseUser = await firebase.auth().createUser({
            email: payload.email,
            displayName: payload.userDisplayName || 'User',
            password: payload.password,
          })
        }

        const response = await accountExecutor.transaction(async transaction => {
          const account = await accountExecutor.create(
            {
              name: payload.name,
              plan: AccountPlan.Gold,
            },
            {transaction},
          )

          const user = await userExecutor.create(
            {
              accountId: account.id!,
              firebaseId: firebaseUser!.uid,
              email: payload.email,
              role: AuthRole.Admin,
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
