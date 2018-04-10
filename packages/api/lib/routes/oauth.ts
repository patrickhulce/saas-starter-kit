import {
  createOAuthTokenHandler,
  IRouterOptions,
  oauthTokenRequestModel,
  oauthTokenResponseModel,
} from 'klay'
import {conf, kiln, ModelID} from '../../../shared/lib'

export const oauthRouterOptions: IRouterOptions = {
  modelName: ModelID.User, // TODO: remove this line
  routes: {
    'POST /token': {
      bodyModel: oauthTokenRequestModel,
      responseModel: oauthTokenResponseModel,
      handler: createOAuthTokenHandler({secret: conf.secret, kiln}),
    },
  },
}
