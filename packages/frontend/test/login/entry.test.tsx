import * as React from 'react'
import * as Enzyme from 'enzyme'
import {LoginPage} from '../../src/login/entry'

describe('login/entry.tsx', () => {
  it('should show login form by default', () => {
    const page = Enzyme.mount(<LoginPage />)
    const formText = page.find('form').text()
    expect(formText).toContain('Login')
    expect(formText).not.toContain('Register')
  })

  it('should show register form when clicked', () => {
    const page = Enzyme.mount(<LoginPage />)
    const createAccount = page.find('button.atmn-create-account')
    createAccount.simulate('click')
    const formText = page.find('form').text()
    expect(formText).toContain('Register')
    expect(formText).not.toContain('Login')
  })
})
