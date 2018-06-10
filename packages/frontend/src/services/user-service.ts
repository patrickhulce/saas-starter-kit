import {IUser} from '../../../shared/lib/typedefs'

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

  const userResponse = await fetch('/api/v1/users/me', {credentials: 'same-origin'})
  if (userResponse.status !== 200) {
    throw new Error('Invalid User')
  }

  const user = await userResponse.json()
  localStorage.setItem('loggedInUser', JSON.stringify(user))
  window.location.href = '/'
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

export async function updateAccount(user: IUser): Promise<void> {
  const response = await fetch(`/api/v1/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {'content-type': 'application/json'},
  })

  if (response.status !== 200) {
    // TODO: Provide more specific error message
    throw new Error('Error updating account')
  }
}
