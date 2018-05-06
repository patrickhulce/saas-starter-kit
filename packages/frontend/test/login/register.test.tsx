import * as React from 'react'
import * as Enzyme from 'enzyme'
import {RegisterForm} from '../../src/login/register'

describe('login/register.tsx', () => {
  it('should render form', () => {
    const form = Enzyme.shallow(<RegisterForm />)
    expect(form).toMatchSnapshot()
  })
})
