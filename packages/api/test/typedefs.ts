import * as express from 'express'
import {SQLExtension} from 'klay'
import {Server} from 'net'
import {IAccount, IUser} from '../../shared/lib/typedefs'

export interface IState {
  app: express.Application
  sqlExtension: SQLExtension
  server?: Server
  port?: number
  baseURL?: string

  login?: {email: string, password: string}
  account?: IAccount
  user?: IUser
  token?: string
}
