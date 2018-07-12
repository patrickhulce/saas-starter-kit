import * as express from 'express'
import {
  ActionType,
  IRouterOptions,
  assert,
  createPasswordValidationMiddleware,
  defaultModelContext,
} from 'klay'

import {
  ModelID,
  Permission,
  VerificationType,
  kiln,
  logger,
  underlyingPasswordModel,
  userExecutor,
  userModel,
  verificationExecutor,
} from '../../../shared/lib'
import {sendPasswordResetEmail} from '../email/email'

const log = logger('api:users')

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
      // Don't mark the key as required, we'll redirect silently to the app instead
      queryModel: defaultModelContext.object().children({key: defaultModelContext.string()}),
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
    'POST /password-reset': {
      bodyModel: defaultModelContext
        .object()
        .children({email: defaultModelContext.email().required()})
        .strict()
        .required(),
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const email = req.body.email
        log('looking up user for reset password', email)

        const user = await userExecutor.findOne({where: {email}})
        if (user) {
          let verification = await verificationExecutor.findOne({
            where: {userId: user.id!, type: VerificationType.ResetPassword, consumed: false},
          })

          if (!verification) {
            verification = await verificationExecutor.create({
              userId: user.id!,
              type: VerificationType.ResetPassword,
              consumed: false,
              meta: {},
            })
          }

          await sendPasswordResetEmail(user.email, user.firstName, verification.key!)
        }

        res.sendStatus(204)
      },
    },
    'PUT /password-reset': {
      bodyModel: defaultModelContext
        .object()
        .children({
          key: defaultModelContext.string().required(),
          password: underlyingPasswordModel.clone().required(),
        })
        .strict()
        .required(),
      async handler(req: express.Request, res: express.Response): Promise<void> {
        const key = req.body.key
        log('looking up verification for reset password', key)

        const verification = await verificationExecutor.findOne({where: {key}})
        assert.ok(verification && !verification.consumed, 'password link expired')

        const user = await userExecutor.findByIdOrThrow(verification!.userId)
        assert.ok(user, 'no such user')

        user.password = req.body.password
        verification!.consumed = true

        await userExecutor.transaction(async transaction => {
          await verificationExecutor.update(verification!, {transaction})
          await userExecutor.update(user, {transaction})
        })

        res.sendStatus(204)
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
