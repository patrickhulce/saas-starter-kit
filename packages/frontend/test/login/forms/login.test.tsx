import * as React from 'react'
import {RenderResult, fireEvent, render, wait} from 'react-testing-library'

import {LoginForm} from '../../../src/login/forms/login'
import {createFetchMock} from '../../utils'
import {testIds} from '../../../src/utils'

describe('login/forms/login.tsx', () => {
  let fetchMock: jest.Mock

  function renderAndFill(): RenderResult {
    const form = render(<LoginForm />)
    const email = form.getByLabelText(/Email/) as HTMLInputElement
    const password = form.getByLabelText(/Password/) as HTMLInputElement
    email.value = 'test@example.com'
    password.value = 'password1'
    return form
  }

  beforeEach(() => {
    fetchMock = jest.fn()
    self.fetch = fetchMock
  })

  it('should render form', () => {
    const form = render(<LoginForm />)
    expect(form.container).toMatchSnapshot()
  })

  it('should show a loading UI', async () => {
    const {getByTestId, queryByTestId} = renderAndFill()
    const mockFetch = createFetchMock()
    fetchMock.mockImplementation(mockFetch.fn)

    fireEvent.submit(getByTestId(testIds.loginForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(queryByTestId(testIds.errorBar)).toBeNull()

    mockFetch.reject(new Error('short-circuit'))
  })

  it('should send login request to server', async () => {
    const {getByTestId} = renderAndFill()
    const mockFetch = createFetchMock()
    fetchMock.mockImplementation(mockFetch.fn)

    fireEvent.submit(getByTestId(testIds.loginForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(fetchMock).toHaveBeenCalled()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })

  it('should show an error UI', async () => {
    const {getByTestId, queryByTestId} = renderAndFill()
    const mockFetch = createFetchMock({status: 400})
    fetchMock.mockImplementation(mockFetch.fn)

    fireEvent.submit(getByTestId(testIds.loginForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(queryByTestId(testIds.errorBar)).toBeNull()

    mockFetch.resolve()
    await wait(() => getByTestId(testIds.errorBar))

    expect(queryByTestId(testIds.loadingBar)).toBeNull()
    expect(getByTestId(testIds.errorBar).textContent).toMatchSnapshot()
  })
})
