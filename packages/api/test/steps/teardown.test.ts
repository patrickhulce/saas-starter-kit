import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('teardown', () => {
    it('should cleanup the account', async () => {
      const query = q => state.sqlExtension.sequelize.query(q)
      await query(`DELETE FROM users where id = ${state.user.id}`)
      await query(`DELETE FROM accounts where id = ${state.account.id}`)
    })

    it('should disconnect from SQL gracefully', async () => {
      await state.sqlExtension.sequelize.close()
    })

    it('should disconnect express gracefully', done => {
      state.server.close(done)
    })
  })
}
