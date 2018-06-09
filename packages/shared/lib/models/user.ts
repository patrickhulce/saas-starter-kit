import {
  ConstraintType,
  DatabaseEvent,
  IModel,
  READ_ACTIONS,
  SortDirection,
  SupplyWithPreset,
  WRITE_ACTIONS,
} from 'klay'

import conf from '../conf'
import {modelContext} from '../model-context'
import {AuthRole, ModelID, Permission} from '../typedefs'

const passwordBase = modelContext.string().max(32)

export const userModel: IModel = modelContext
  .object()
  .children({
    id: modelContext.integerId(),
    accountId: modelContext
      .integer()
      .constrain({type: ConstraintType.Immutable})
      .constrain({type: ConstraintType.Reference, meta: {referencedModel: ModelID.Account}}),
    role: modelContext.string().enum([AuthRole.Admin, AuthRole.User]),
    email: modelContext
      .email()
      .max(250)
      .constrain({type: ConstraintType.Unique}),
    isVerified: modelContext.boolean(),
    // TODO: add a "api-hidden" property
    verificationKey: modelContext
      .uuid()
      .constrain({type: ConstraintType.Immutable})
      .automanage({event: DatabaseEvent.Create, supplyWith: SupplyWithPreset.UUID}),
    password: modelContext.password({salt: conf.secret, model: passwordBase}),
    firstName: modelContext.string().max(100),
    lastName: modelContext.string().max(100),
    createdAt: modelContext.createdAt(),
    updatedAt: modelContext.updatedAt(),
  })
  .index([['email'], ['password']])
  .index([{property: ['updatedAt'], direction: SortDirection.Descending}])
  .authorization({
    actions: READ_ACTIONS,
    permission: Permission.UserView,
    criteria: [['accountId']],
  })
  .authorization({
    actions: WRITE_ACTIONS,
    permission: Permission.UserManage,
    criteria: [['id'], ['accountId']],
  })
