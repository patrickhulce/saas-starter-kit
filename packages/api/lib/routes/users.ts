import * as express from 'express'
import {CRUD_ROUTES, IDatabaseExecutor, IRouterOptions} from 'klay'
import {IUser, kiln, ModelID, sqlExtension, userModel} from '../../../shared/lib'

const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>

export const usersRouterOptions: IRouterOptions = {
  modelName: ModelID.User,
  routes: {
    ...CRUD_ROUTES,
    'GET /me': {
      responseModel: userModel,
      async handler(req: express.Request, res: express.Response): Promise<void> {
        if (!req.grants) throw new Error('Not authorized')
        const id = (req.grants as any).userContext.id
        const user = await userExecutor.findById(id)
        if (!user) throw new Error('No such user')
        res.json(user)
      },
    },
  },
}
