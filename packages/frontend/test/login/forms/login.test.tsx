import * as React from 'react'
import {render} from 'react-testing-library'
import {LoginForm} from '../../../src/login/forms/login'

describe('login/forms/login.tsx', () => {
  it('should render form', () => {
    const form = render(<LoginForm />)
    expect(form.container).toMatchSnapshot()
  })
})
