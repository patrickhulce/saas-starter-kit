import {
  createOAuthTokenHandler,
  IRouterOptions,
  oauthTokenRequestModel,
  oauthTokenResponseModel,
} from 'klay'
import {conf, kiln} from '../../../shared/lib'

export const oauthRouterOptions: IRouterOptions = {
  routes: {
    'POST /token': {
      bodyModel: oauthTokenRequestModel,
      responseModel: oauthTokenResponseModel,
      handler: createOAuthTokenHandler({secret: conf.secret, kiln}),
    },
  },
}
