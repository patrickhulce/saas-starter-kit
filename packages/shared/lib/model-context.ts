import {DatabaseExtension, ExpressExtension, IModelContext, ModelContext} from 'klay'

export const modelContext: IModelContext = ModelContext.create()
  .use(new DatabaseExtension())
  .use(new ExpressExtension())
  .use({defaults: {strict: true, required: true}})
