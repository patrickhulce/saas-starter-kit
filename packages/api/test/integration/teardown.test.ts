import {IState} from '../typedefs'

module.exports = (state: IState) => {
  describe('teardown', () => {
    it('should disconnect from SQL gracefully', async () => {
      await state.sqlExtension.sequelize.close()
    })

    it('should disconnect express gracefully', done => {
      state.server.close(done)
    })
  })
}
