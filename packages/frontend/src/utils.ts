import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {IUser} from '../../shared/lib/typedefs'

import {getLoggedInUser, refreshLoggedInUser} from './services/user-service'

export async function redirectToLogin(): Promise<void> {
  window.location.href = '/login'
  return new Promise(resolve => setTimeout(resolve, 10000)) as Promise<void>
}

export async function redirectIfNotAuthorized(): Promise<void> {
  try {
    const localUser = await getLoggedInUser()
    if (!localUser) await redirectToLogin()
    await refreshLoggedInUser()
    const remoteUser = await getLoggedInUser()
    if (!remoteUser || localUser!.id !== remoteUser.id) await redirectToLogin()
  } catch (err) {
    await redirectToLogin()
  }
}

export async function findUserOnStartupOrBail(): Promise<IUser> {
  const localUser = await getLoggedInUser()
  if (!localUser) await redirectToLogin()
  setTimeout(redirectIfNotAuthorized, 0)
  return localUser!
}

export function createRenderFn(render: () => React.ReactElement<any>): () => void {
  return () => ReactDOM.render(render(), document.getElementById('app-root'))
}

export function HMR(nodeModule: any, handle: (nodeModule: any) => any): void {
  if (nodeModule.hot) {
    handle(nodeModule)
  }
}

export const testIds = {
  loadingBar: 'loading-bar',
  messageBar: 'message-bar',
  // Login IDs
  createAccountTab: 'create-account-tab',
  createAccountSubmit: 'create-account-submit',
  loginFormPrimaryBtn: 'login-form-primary-btn',
  loginFormSecondaryBtn: 'login-form-secondary-btn',
  loginForm: 'login-form',
  registerForm: 'register-form',
  profileNamesForm: 'profile-names-form',
}
