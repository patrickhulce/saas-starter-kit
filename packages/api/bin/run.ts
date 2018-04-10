import {app} from '../lib/app'

const server = app.listen(process.env.PORT || 3000, () => {
  // tslint:disable-next-line
  console.log('Server is listening on port', server.address().port)
})
