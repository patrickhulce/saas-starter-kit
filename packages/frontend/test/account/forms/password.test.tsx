import * as React from 'react'
import {fireEvent, render, wait} from 'react-testing-library'

import {IUser} from '../../../../shared/lib/typedefs'
import {PasswordForm} from '../../../src/account/forms/password'
import {testIds} from '../../../src/utils'
import {createFetchPromise} from '../../utils'

describe('account/forms/profile.tsx', () => {
  let fetchMock: jest.Mock
  let user: IUser

  beforeEach(() => {
    fetchMock = jest.fn()
    user = {id: 1, email: 'klay@example.com'} as IUser
    self.fetch = fetchMock
  })

  it('should render form', () => {
    const form = render(<PasswordForm user={user} />)
    expect(form.container).toMatchSnapshot()
  })

  it('should send update names request to server', async () => {
    const {getByTestId} = render(<PasswordForm user={user} />)
    const mockFetch = createFetchPromise()
    fetchMock.mockImplementation(mockFetch.fn)

    fireEvent.submit(getByTestId(testIds.defaultForm))
    await wait(() => getByTestId(testIds.loadingBar))

    expect(fetchMock).toHaveBeenCalled()
    expect(fetchMock.mock.calls[0]).toMatchSnapshot()
  })
})
