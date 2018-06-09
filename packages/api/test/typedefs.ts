// tslint:disable
import * as express from 'express'
import {IDatabaseExecutor, SQLExtension} from 'klay'
import {Server} from 'net'

import {IAccount, IUser} from '../../shared/lib/typedefs'

export interface IState {
  app: express.Application
  sqlExtension: SQLExtension
  userExecutor: IDatabaseExecutor<IUser>
  server?: Server
  port?: number
  baseURL?: string
  apiURL?: string

  login?: {email: string; password: string}
  account?: IAccount
  user?: IUser
  token?: string
}

declare global {
  var __sparkpostSend: jest.Mock
  var __fetch: jest.Mock
  var __requestGet: jest.Mock
}
