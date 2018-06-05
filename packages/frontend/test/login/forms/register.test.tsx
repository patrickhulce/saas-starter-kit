import * as React from 'react'
import {render} from 'react-testing-library'
import {RegisterForm} from '../../../src/login/forms/register'

describe('login/forms/register.tsx', () => {
  it('should render form', () => {
    const form = render(<RegisterForm />)
    expect(form.container).toMatchSnapshot()
  })
})