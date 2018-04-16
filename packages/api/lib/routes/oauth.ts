import * as firebase from 'firebase'
import * as firebaseAdmin from 'firebase-admin'
import {
  createOAuthTokenHandler,
  IDatabaseExecutor,
  IRouterOptions,
  oauthTokenRequestModel,
  oauthTokenResponseModel,
} from 'klay'
import {conf, IUser, kiln, ModelID, sqlExtension} from '../../../shared/lib'

const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>

export const oauthRouterOptions: IRouterOptions = {
  routes: {
    'POST /token': {
      bodyModel: oauthTokenRequestModel,
      responseModel: oauthTokenResponseModel,
      handler: createOAuthTokenHandler({
        kiln,
        secret: conf.secret,
        async lookupUserContextByPassword(
          username: string,
          password: string,
        ): Promise<IUser | undefined> {
          try {
            let firebaseId: string
            if (username.includes('@')) {
              const user = await firebase.auth().signInWithEmailAndPassword(username, password)
              firebaseId = user.uid
            } else {
              firebaseId = (await firebaseAdmin.auth().verifyIdToken(password)).uid
            }

            return userExecutor.findOne({where: {firebaseId}})
          } catch (err) {
            // ignore errors from firebase we want an empty user
          }
        },
      }),
    },
  },
}
