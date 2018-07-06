import * as express from 'express'
import {ActionType, IRouterOptions, createPasswordValidationMiddleware} from 'klay'

import {
  ModelID,
  Permission,
  kiln,
  userExecutor,
  userModel,
  verificationExecutor,
} from '../../../shared/lib'

// tslint:disable-next-line
const log = require('debug')('the-product:api:users')

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
        res.json(user)
      },
    },
    'GET /verifications': {
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const key = req.query && req.query.key
        if (!key) return res.redirect('/')

        log('attempting verification of', key)
        const verification = await verificationExecutor.findOne({where: {key}})
        if (!verification || verification.consumed) return res.redirect('/')

        log('attempting verification for', verification.userId)
        const user = await userExecutor.findById(verification.userId)
        if (!user) return res.redirect('/')

        verification.consumed = true
        user.isVerified = true

        await userExecutor.transaction(async transaction => {
          await verificationExecutor.update(verification, {transaction})
          await userExecutor.update(user, {transaction})
        })

        res.redirect('/?verification=success')
      },
    },
    'PUT /:id/password': {
      type: ActionType.Patch,
      patchProperties: ['password'],
      authorization: {permission: Permission.UserPassword},
      middleware: {preResponse: createPasswordValidationMiddleware({kiln})},
    },
    'PUT /:id/profile': {
      type: ActionType.Patch,
      patchProperties: ['firstName', 'lastName'],
      authorization: {permission: Permission.UserPassword},
    },
  },
}
