/* tslint:disable no-unsafe-any */
import * as fetch from 'isomorphic-fetch'
import {URLSearchParams} from 'url'
import {v4 as uuid} from 'uuid'

import {IMailService, IMailbox, IMessage} from './typedefs'

export class TestMailbox implements IMailService {
  public rootURL: string

  public constructor(rootURL: string) {
    this.rootURL = rootURL
  }

  public async createInbox(): Promise<IMailbox> {
    const id = uuid()
    const address = `${id}@example.com`
    return {id, address}
  }

  public async readMail(inbox: IMailbox, waitFor?: number): Promise<IMessage[]> {
    const queryOpts = new URLSearchParams({email: inbox.address}).toString()
    const response = await fetch(`${this.rootURL}/_test/mailboxes?${queryOpts}`)
    const body = await response.json()
    if (waitFor && body.messages.length < waitFor) {
      return new Promise<IMessage[]>(resolve => {
        setTimeout(async () => {
          resolve(await this.readMail(inbox, waitFor))
        }, 500)
      })
    }

    const messages = body.messages as any[]
    return messages.map(msg => ({
      to: [inbox.address],
      from: msg.from,
      subject: msg.subject,
      body: msg.html,
    }))
  }
}
