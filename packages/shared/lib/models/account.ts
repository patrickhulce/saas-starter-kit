import {
  ConstraintType,
  IModel,
  READ_ACTIONS,
  SortDirection,
  WRITE_ACTIONS,
} from 'klay'
import {kebabCase, values} from 'lodash'
import {modelContext} from '../model-context'
import {AccountPlan, Permission} from '../typedefs'

export const accountModel: IModel = modelContext
  .object()
  .children({
    id: modelContext.integerId(),
    name: modelContext.string().max(100),
    slug: modelContext
      .string()
      .max(100)
      .optional()
      .coerce(result => result.setValue(result.value || kebabCase(result.rootValue.name)))
      .constrain({type: ConstraintType.Unique}),
    plan: modelContext.string().enum(values(AccountPlan)),
    createdAt: modelContext.createdAt(),
    updatedAt: modelContext.updatedAt(),
  })
  .index([['name']])
  .index([{property: ['updatedAt'], direction: SortDirection.Descending}])
  .authorization({actions: READ_ACTIONS, permission: Permission.AccountView, criteria: [['id']]})
  .authorization({
    actions: WRITE_ACTIONS,
    permission: Permission.AccountManage,
    criteria: [['id']],
  })
