// tslint:disable typedef
import * as express from 'express'

export const _testRoutes: express.Router = express.Router()

const _testMailboxes: any = {}

export function _sendToTestMailbox(email: string, message: any): void {
  const mailbox = _testMailboxes[email] || {email, messages: []}
  mailbox.messages.push(message)
  _testMailboxes[email] = mailbox
}

_testRoutes.get('/mailboxes', (req, res) => {
  const email = req.query && req.query.email
  const response = email ? _testMailboxes[email] : _testMailboxes
  res.json(response || {})
})
