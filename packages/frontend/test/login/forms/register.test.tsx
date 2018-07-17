import * as React from 'react'
import {RenderResult, fireEvent, render, wait} from 'react-testing-library'

import {RegisterForm} from '../../../src/login/forms/register'
import {testIds} from '../../../src/utils'
import {createFetchPromise} from '../../utils'

describe('register/forms/register.tsx', () => {
  let fetchMock: jest.Mock

  function renderAndFill(): RenderResult {
    const form = render(<RegisterForm />)
    const firstName = form.getByLabelText(/First Name/) as HTMLInputElement
    const lastName = form.getByLabelText(/Last Name/) as HTMLInputElement
    const email = form.getByLabelText(/Email/) as HTMLInputElement
    const password = form.getByLabelText(/^Password/) as HTMLInputElement
    const confirmPassword = form.getByLabelText(/Confirm Password/) as HTMLInputElement
    firstName.value = 'Klay'
    lastName.value = 'Thompson'
    email.value = 'klay@example.com'
    password.value = 'rocko'
    confirmPassword.value = 'rocko'
    return form
  }

  beforeEach(() => {
    fetchMock = jest.fn()
    self.fetch = fetchMock
  })

  it('should render form', () => {
    const form = render(<RegisterForm />)
    expect(form.container).toMatchSnapshot()
  })

  it('should check passwords match', async () => {
    const {getByTestId, getByLabelText} = renderAndFill()
    const confirmPassword = getByLabelText(/Confirm Password/) as HTMLInputElement
    confirmPassword.value = 'other'

    fireEvent.submit(getByTestId(testIds.registerForm))
    await wait(() => getByTestId(testIds.messageBar))

    expect(getByTestId(testIds.messageBar).textContent).toMatchSnapshot()
  })

  it('should show a loading UI', async () => {
    const {getByTestId, queryByTestId} = renderAndFill()
    const fetchPromise = createFetchPromise()
    fetchMock.mockImplementation(fetchPromise.fn)

    fireEvent.submit(getByTestId(testIds.registerForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(queryByTestId(testIds.messageBar)).toBeNull()

    fetchPromise.reject(new Error('short-circuit'))
  })

  it('should send register request to server', async () => {
    const {getByTestId} = renderAndFill()
    const fetchPromise = createFetchPromise()
    fetchMock.mockImplementation(fetchPromise.fn)

    fireEvent.submit(getByTestId(testIds.registerForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(fetchMock).toHaveBeenCalled()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })

  it('should show an error UI', async () => {
    const {getByTestId, queryByTestId} = renderAndFill()
    const fetchPromise = createFetchPromise({status: 400})
    fetchMock.mockImplementation(fetchPromise.fn)

    fireEvent.submit(getByTestId(testIds.registerForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(queryByTestId(testIds.messageBar)).toBeNull()

    fetchPromise.resolve()
    await wait(() => getByTestId(testIds.messageBar))

    expect(queryByTestId(testIds.loadingBar)).toBeNull()
    expect(getByTestId(testIds.messageBar).textContent).toMatchSnapshot()
  })
})
