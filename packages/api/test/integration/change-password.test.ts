import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('change password', () => {
    it('should reject unauthenticated password changes', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/${state.user.id}/password`, {
        method: 'POST',
        body: JSON.stringify({password: 'new-password1'}),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(401)
    })

    it('should reject password changes that do not confirm existing password', async () => {
      const response = await fetch(`${state.apiURL}/v1/users/${state.user.id}/password`, {
        method: 'POST',
        body: JSON.stringify({password: 'new-password1'}),
        headers: {'content-type': 'application/json'},
      })

      expect(response.status).toBe(401)
    })
  })
}
