import * as React from 'react'
import {render, fireEvent, wait, waitForElement} from 'react-testing-library'
import {LoginForm} from '../../../src/login/forms/login'

describe('login/forms/login.tsx', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    const mockFetch =
    fetchMock = jest.fn().mockImplementation(async () => ({status: 200}))
    self.fetch = fetchMock
  })

  it('should render form', () => {
    const form = render(<LoginForm />)
    expect(form.container).toMatchSnapshot()
  })

  it('should show a loading UI', async () => {
    const {getByLabelText, getByTestId} = render(<LoginForm />)
    const email = getByLabelText(/Email/) as HTMLInputElement
    const password = getByLabelText(/Password/) as HTMLInputElement
    email.value = 'test@example.com'
    password.value = 'password1'

    // FIXME: this should really be using wait, but it breaks the test
    // make a helper for fetch mock to make this easier
    fireEvent.submit(getByTestId('login-form'))
    await waitForElement(() => getByTestId('loading-bar'))
  })

  it('should show an error UI', async () => {
    const {getByText, queryByTestId, getByLabelText, getByTestId} = render(<LoginForm />)
    const email = getByLabelText(/Email/) as HTMLInputElement
    const password = getByLabelText(/Password/) as HTMLInputElement
    email.value = 'test@example.com'
    password.value = 'password1'

    let fetchResolve = (x: any) => x
    const fetchReturn = new Promise(resolve => { fetchResolve = resolve })
    fetchMock.mockReturnValue(fetchReturn)

    fireEvent.submit(getByTestId('login-form'))
    await wait(() => getByTestId('loading-bar'))
    expect(queryByTestId(/Invalid login/)).toBeNull()

    fetchResolve({status: 400})
    await wait(() => getByText(/Invalid login/))

    expect(queryByTestId('loading-bar')).toBeNull()
    expect(getByText(/Invalid login/)).toMatchSnapshot()
  })
})
