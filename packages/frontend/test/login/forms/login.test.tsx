import * as React from 'react'
import {render, fireEvent, wait, waitForElement} from 'react-testing-library'
import {LoginForm} from '../../../src/login/forms/login'
import {createFetchMock} from '../../utils'

describe('login/forms/login.tsx', () => {
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn().mockImplementation(async () => ({status: 200}))
    self.fetch = fetchMock
  })

  it('should render form', () => {
    const form = render(<LoginForm />)
    expect(form.container).toMatchSnapshot()
  })

  it('should show a loading UI', async () => {
    const {getByLabelText, getByTestId, queryByTestId} = render(<LoginForm />)
    const email = getByLabelText(/Email/) as HTMLInputElement
    const password = getByLabelText(/Password/) as HTMLInputElement
    email.value = 'test@example.com'
    password.value = 'password1'

    const mockFetch = createFetchMock()
    fetchMock.mockImplementation(mockFetch.fn)

    fireEvent.submit(getByTestId('login-form'))
    await wait(() => getByTestId('loading-bar'))
    expect(queryByTestId('error-bar')).toBeNull()
    mockFetch.reject(new Error('short-circuit'))
  })

  it('should show an error UI', async () => {
    const {getByText, queryByTestId, getByLabelText, getByTestId} = render(<LoginForm />)
    const email = getByLabelText(/Email/) as HTMLInputElement
    const password = getByLabelText(/Password/) as HTMLInputElement
    email.value = 'test@example.com'
    password.value = 'password1'

    const mockFetch = createFetchMock({status: 400})
    fetchMock.mockImplementation(mockFetch.fn)

    fireEvent.submit(getByTestId('login-form'))
    await wait(() => getByTestId('loading-bar'))
    expect(queryByTestId('error-bar')).toBeNull()

    mockFetch.resolve()
    await wait(() => getByTestId('error-bar'))

    expect(queryByTestId('loading-bar')).toBeNull()
    expect(getByTestId('error-bar').textContent).toMatchSnapshot()
  })
})
