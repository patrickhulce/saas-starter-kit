import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('change profile', () => {
    it('should accept name changes', async () => {
      const payload = {firstName: 'First', lastName: 'Last'}
      const response = await fetch(`${state.apiURL}/v1/users/${state.user.id}/profile`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {'content-type': 'application/json', cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      expect(await response.json()).toMatchObject(payload)
    })

    it('should fetch updates', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/me`, {
        headers: {cookie: `token=${state.token}`},
      })

      expect(response.status).toBe(200)
      expect(await response.json()).toMatchObject({firstName: 'First', lastName: 'Last'})
    })
  })
}
