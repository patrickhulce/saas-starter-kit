import * as React from 'react'
import {Simulate, render, wait} from 'react-testing-library'

import {LoginPage} from '../../src/login/page'

describe('login/page.tsx', () => {
  it('should show login form by default', () => {
    const page = render(<LoginPage />)
    const formText = page.container.querySelector('form')!.textContent
    expect(formText).toContain('Login')
    expect(formText).not.toContain('Register')
  })

  it('should show register form when clicked', async () => {
    const page = render(<LoginPage />)
    const createAccount = page.getByText(/create.*account/i)
    Simulate.click(createAccount)

    await wait(() => page.getByLabelText(/First Name/))
    const formText = page.container.querySelector('form')!.textContent
    expect(formText).toContain('Register')
    expect(formText).not.toContain('Login')
  })
})
