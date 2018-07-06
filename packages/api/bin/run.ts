import conf from '../../shared/lib/conf'
import {app} from '../lib/app'

const server = app.listen(process.env.PORT || 5000, () => {
  const port = server.address().port
  // tslint:disable-next-line
  console.log('API is available on port', port)

  if (conf.origin === 'http://localhost') {
    conf.origin = `http://localhost:${port}`
  }
})
