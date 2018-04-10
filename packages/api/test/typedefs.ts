import * as express from 'express'
import {SQLExtension} from 'klay'
import {Server} from 'net'

export interface IState {
  app: express.Application
  sqlExtension: SQLExtension
  server?: Server
  port?: number
  baseURL?: string
}
