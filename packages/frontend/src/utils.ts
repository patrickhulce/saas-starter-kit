import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {IUser} from '../../shared/lib/typedefs'

export async function redirectToLogin(): Promise<void> {
  window.location.href = '/login'
  return new Promise(resolve => setTimeout(resolve, 10000)) as Promise<void>
}

export function getLocalUser(): IUser | undefined {
  try {
    const localUser = JSON.parse(localStorage.getItem('loggedInUser') || '')
    if (localUser && typeof localUser === 'object' && localUser.id) return localUser
  } catch (e) {}
}

export async function redirectIfNotAuthorized(): Promise<void> {
  const localUser = getLocalUser()
  if (!localUser) await redirectToLogin()
  const response = await fetch('/api/v1/users/me', {credentials: 'same-origin'})
  if (response.status !== 200) await redirectToLogin()
  const remoteUser: IUser = await response.json()
  if (localUser!.id !== remoteUser.id) await redirectToLogin()
}

export async function findUserOrRedirect(): Promise<IUser> {
  const localUser = getLocalUser()
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
  errorBar: 'error-bar',
  // Login IDs
  createAccountTab: 'create-account-tab',
  createAccountSubmit: 'create-account-submit',
  loginForm: 'login-form',
  registerForm: 'register-form',
}
