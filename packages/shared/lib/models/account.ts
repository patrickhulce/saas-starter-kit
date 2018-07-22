import {ConstraintType, IModel, READ_ACTIONS, SortDirection, WRITE_ACTIONS} from 'klay'
import {values} from 'lodash'

import {modelContext} from '../model-context'
import {AccountPlan, Permission} from '../typedefs'

export const accountModel: IModel = modelContext
  .object()
  .children({
    id: modelContext.integerId(),
    name: modelContext.string().max(40),
    plan: modelContext.string().enum(values(AccountPlan)),
    stripeId: modelContext
      .string()
      .constrain({type: ConstraintType.Unique})
      .nullable()
      .max(40),
    createdAt: modelContext.createdAt(),
    updatedAt: modelContext.updatedAt(),
  })
  .index([{property: ['updatedAt'], direction: SortDirection.Descending}])
  .authorization({actions: READ_ACTIONS, permission: Permission.AccountView})
  .authorization({actions: WRITE_ACTIONS, permission: Permission.AccountManage})
