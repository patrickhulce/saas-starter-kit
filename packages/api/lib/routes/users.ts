import * as express from 'express'
import {IDatabaseExecutor, IRouterOptions} from 'klay'
import {IUser, kiln, ModelID, sqlExtension, userModel} from '../../../shared/lib'

const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>

export const usersRouterOptions: IRouterOptions = {
  modelName: ModelID.User,
  routes: {
    'GET /me': {
      responseModel: userModel,
      async handler(req: express.Request, res: express.Response): Promise<void> {
        if (!req.grants || !req.grants.userContext) throw new Error('Not authorized')
        const id = req.grants.userContext.id
        const user = await userExecutor.findById(id)
        if (!user) throw new Error('No such user')
        user.verificationKey = undefined
        res.json(user)
      },
    },
    'GET /verifications': {
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const verificationKey = req.query && req.query.key
        if (!verificationKey) return res.redirect('/')
        const user = await userExecutor.findOne({where: {verificationKey}})
        if (!user) return res.redirect('/')

        user.isVerified = true
        await userExecutor.update(user)
        res.redirect('/?verification=success')
      },
    },
  },
}
