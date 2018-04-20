/* tslint:disable */
import './login.scss'
import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'

const uiConfig = {
  tosUrl: 'THE_PRODUCT_WWW_URL/tos',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    uiShown() {
      document.getElementById('loader-container')!.style.display = 'none'
      document.getElementById('firebaseui-auth-container')!.style.display = 'block'
    },
    async signInSuccessWithAuthResult(authResult) {
      document.getElementById('loader-container')!.style.display = 'block'
      document.getElementById('firebaseui-auth-container')!.style.display = 'none'

      if (authResult.additionalUserInfo.isNewUser) {
        await fetch('/api/v1/accounts/register', {
          method: 'POST',
          body: JSON.stringify({
            name: `${authResult.user.displayName}'s Account`,
            email: authResult.user.email,
          }),
          headers: {'content-type': 'application/json'},
        })
      }

      const firebaseToken = await authResult.user.getIdToken()
      await fetch('/api/v1/oauth/tokens', {
        method: 'POST',
        body: JSON.stringify({username: '', password: firebaseToken}),
        headers: {'content-type': 'application/json'},
      })
    },
  },
}

const ui = new firebaseui.auth.AuthUI(firebase.auth())
ui.start('#firebaseui-auth-container', uiConfig)
