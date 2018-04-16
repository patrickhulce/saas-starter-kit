import {ConstraintType, IModel, READ_ACTIONS, SortDirection, WRITE_ACTIONS} from 'klay'
import {modelContext} from '../model-context'
import {AuthRole, ModelID, Permission} from '../typedefs'

export const userModel: IModel = modelContext
  .object()
  .children({
    id: modelContext.integerId(),
    accountId: modelContext
      .integer()
      .constrain({type: ConstraintType.Immutable})
      .constrain({type: ConstraintType.Reference, meta: {referencedModel: ModelID.Account}}),
    firebaseId: modelContext
      .string()
      .max(40)
      .constrain({type: ConstraintType.Unique}),
    role: modelContext.string().enum([AuthRole.Admin, AuthRole.User]),
    email: modelContext
      .email()
      .max(250)
      .constrain({type: ConstraintType.Unique}),
    createdAt: modelContext.createdAt(),
    updatedAt: modelContext.updatedAt(),
  })
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
