import {CRUD_ROUTES, IRouterOptions} from 'klay'
import {ModelID} from '../../../shared/lib'

export const usersRouterOptions: IRouterOptions = {
  modelName: ModelID.User,
  routes: CRUD_ROUTES,
}
