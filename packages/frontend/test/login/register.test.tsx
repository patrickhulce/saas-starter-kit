import * as React from 'react'
import {render} from 'react-testing-library'
import {RegisterForm} from '../../src/login/register'

describe('login/register.tsx', () => {
  it('should render form', () => {
    const form = render(<RegisterForm />)
    expect(form.container).toMatchSnapshot()
  })
})
