import {randomBytes} from 'crypto'
import {
  ConstraintType,
  DatabaseEvent,
  IModel,
  READ_ACTIONS,
  SortDirection,
  WRITE_ACTIONS,
} from 'klay'
import {values} from 'lodash'

import {modelContext} from '../model-context'
import {ModelID, Permission, VerificationType} from '../typedefs'

export const verificationModel: IModel = modelContext
  .object()
  .children({
    id: modelContext.integerId(),
    userId: modelContext
      .integer()
      .constrain({type: ConstraintType.Immutable})
      .constrain({type: ConstraintType.Reference, meta: {referencedModel: ModelID.User}}),
    key: modelContext
      .string()
      .max(40)
      .constrain({type: ConstraintType.Immutable})
      .constrain({type: ConstraintType.Unique})
      .automanage({
        event: DatabaseEvent.Create,
        supplyWith: vr => vr.setValue(randomBytes(20).toString('hex')),
      }),
    type: modelContext.string().enum(values(VerificationType)),
    consumed: modelContext.boolean(),
    meta: modelContext.object().children({
      ip: modelContext
        .ip()
        .optional()
        .nullable(),
    }),
    createdAt: modelContext.createdAt(),
    updatedAt: modelContext.updatedAt(),
  })
  .index([{property: ['consumed', 'key'], direction: SortDirection.Ascending}])
  .authorization({actions: READ_ACTIONS, permission: Permission.RootAccess})
  .authorization({actions: WRITE_ACTIONS, permission: Permission.RootAccess})
