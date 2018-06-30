/* tslint:disable no-unsafe-any */
import * as fetch from 'isomorphic-fetch'

import {IMailService, IMailbox, IMessage} from './typedefs'

const URL = 'https://api.mailslurp.com'

export class Mailslurp implements IMailService {
  public key: string

  public constructor(key: string) {
    this.key = key
  }

  public async createInbox(): Promise<IMailbox> {
    const response = await fetch(`${URL}/inboxes?apiKey=${this.key}`, {method: 'POST'})
    const body = await response.json()
    return body.payload as IMailbox
  }

  public async readMail(inbox: IMailbox, waitFor?: number): Promise<IMessage[]> {
    const queryOpts = waitFor ? `&minCount=${waitFor}` : ''
    const response = await fetch(`${URL}/inboxes/${inbox.id}?apiKey=${this.key}${queryOpts}`)
    const body = await response.json()
    return body.payload as IMessage[]
  }

  public async sendMessage(to: string, message: string, from: IMailbox): Promise<void> {
    await fetch(`${URL}/inboxes/${from.id}?apiKey=${this.key}`, {
      method: 'POST',
      body: JSON.stringify({to, subject: message, body: message}),
      headers: {'content-type': 'application/json'},
    })
  }
}
