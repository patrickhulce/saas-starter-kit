import * as React from 'react'
import {RenderResult, Simulate, fireEvent, render, wait} from 'react-testing-library'

import {LoginForm} from '../../../src/login/forms/login'
import {createFetchPromise} from '../../utils'
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
    const fetchDeferred = createFetchPromise()
    fetchMock.mockImplementation(fetchDeferred.fn)

    fireEvent.submit(getByTestId(testIds.loginForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(queryByTestId(testIds.messageBar)).toBeNull()

    fetchDeferred.reject(new Error('short-circuit'))
  })

  it('should send login request to server', async () => {
    const {getByTestId} = renderAndFill()
    const fetchDeferred = createFetchPromise()
    fetchMock.mockImplementation(fetchDeferred.fn)

    fireEvent.submit(getByTestId(testIds.loginForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(fetchMock).toHaveBeenCalled()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })

  it('should show an error UI', async () => {
    const {getByTestId, queryByTestId} = renderAndFill()
    const fetchPromise = createFetchPromise({status: 400})
    fetchMock.mockImplementation(fetchPromise.fn)

    fireEvent.submit(getByTestId(testIds.loginForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(queryByTestId(testIds.messageBar)).toBeNull()

    fetchPromise.resolve()
    await wait(() => getByTestId(testIds.messageBar))

    expect(queryByTestId(testIds.loadingBar)).toBeNull()
    expect(getByTestId(testIds.messageBar).textContent).toMatchSnapshot()
  })

  it('should trigger forgot password UI', async () => {
    const {getByText, getByTestId} = renderAndFill()
    const fetchDeferred = createFetchPromise({status: 204})
    fetchMock.mockImplementation(fetchDeferred.fn)

    // TODO: move this back to getByText once figure out how to make it pick the button
    Simulate.click(getByTestId(testIds.loginFormSecondaryBtn))
    await wait(() => getByText(/reset/i))
    fireEvent.submit(getByTestId(testIds.loginForm))

    fetchDeferred.resolve()
    expect(fetchMock).toHaveBeenCalled()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
    await wait(() => getByText(/email sent/i))
  })
})
