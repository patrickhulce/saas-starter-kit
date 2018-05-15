import {IDatabaseExecutor} from 'klay'
import {IState} from './typedefs'
import {app, sqlExtension} from '../lib/app'
import {conf, kiln, ModelID, IUser} from '../../shared/lib'

describe('lib/app.ts', () => {
  const userExecutor = kiln.build(ModelID.User, sqlExtension) as IDatabaseExecutor<IUser>
  const state: IState = {app, sqlExtension, userExecutor}

  require('./integration/setup.test')(state)
  require('./integration/teardown.test')(state)
})
