import {IUser} from '../../../shared/lib/typedefs'

export async function getLoggedInUser(): Promise<IUser | undefined> {
  try {
    const localUser = JSON.parse(localStorage.getItem('loggedInUser') || '')
    if (localUser && typeof localUser === 'object' && localUser.id) return localUser
  } catch (e) {}
}

export async function login(email: string, password: string): Promise<void> {
  const authResponse = await fetch('/api/v1/oauth/token', {
    method: 'POST',
    body: JSON.stringify({username: email, password, grant_type: 'password'}),
    headers: {'content-type': 'application/json'},
    credentials: 'same-origin',
  })

  if (authResponse.status !== 200) {
    throw new Error('Unauthorized')
  }

  await refreshLoggedInUser()
  window.location.href = '/'
}

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch('/api/v1/users/password-reset', {
    method: 'POST',
    body: JSON.stringify({email}),
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 204) throw new Error('Password reset request failed')
}

export async function resetPassword(key: string, password: string): Promise<void> {
  const response = await fetch('/api/v1/users/password-reset', {
    method: 'PUT',
    body: JSON.stringify({key, password}),
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 204) throw new Error('Password reset failed')
}

export async function createAccount(
  accountName: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<any> {
  const response = await fetch('/api/v1/accounts/register', {
    method: 'POST',
    body: JSON.stringify({
      account: {name: accountName},
      user: {firstName, lastName, email, password},
    }),
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 200) {
    // TODO: Provide more specific error message
    throw new Error('Error creating account')
  }

  await login(email, password)
}

export async function updateAccount(
  userId: IUser['id'],
  user: Pick<IUser, 'firstName' | 'lastName'>,
): Promise<void> {
  const response = await fetch(`/api/v1/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(user),
    credentials: 'same-origin',
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 200) {
    // TODO: Provide more specific error message
    throw new Error('Error updating account')
  }

  await refreshLoggedInUser()
}

export async function refreshLoggedInUser(): Promise<void> {
  const userResponse = await fetch('/api/v1/users/me', {credentials: 'same-origin'})
  if (userResponse.status !== 200) {
    localStorage.removeItem('loggedInUser')
    throw new Error('Invalid User')
  }

  const user = await userResponse.json()
  localStorage.setItem('loggedInUser', JSON.stringify(user))
}
