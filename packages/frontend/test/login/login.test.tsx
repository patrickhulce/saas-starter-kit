import * as React from 'react'
import {render} from 'react-testing-library'
import {LoginForm} from '../../src/login/login'

describe('login/login.tsx', () => {
  it('should render form', () => {
    const form = render(<LoginForm />)
    expect(form.container).toMatchSnapshot()
  })
})
