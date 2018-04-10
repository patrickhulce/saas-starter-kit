import {app, sqlExtension} from '../lib/app'

describe('lib/app.ts', () => {
  let server

  it('should export a working server', done => {
    server = app.listen(done)
  })

  it('should disconnect from SQL gracefully', async () => {
    await sqlExtension.sequelize.close()
  })

  it('should disconnect express gracefully', done => {
    server.close(done)
  })
})
