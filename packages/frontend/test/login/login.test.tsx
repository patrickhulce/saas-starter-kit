import * as React from 'react'
import * as Enzyme from 'enzyme'
import {LoginForm} from '../../src/login/login'

describe('login/login.tsx', () => {
  it('should render form', () => {
    const form = Enzyme.shallow(<LoginForm />)
    expect(form).toMatchSnapshot()
  })
})
