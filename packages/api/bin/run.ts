import {app} from '../lib/app'

const server = app.listen(process.env.PORT || 5000, () => {
  // tslint:disable-next-line
  console.log('API is available on port', server.address().port)
})
