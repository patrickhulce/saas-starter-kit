import {template} from 'lodash'
import * as Sparkpost from 'sparkpost'

import conf from '../../../shared/lib/conf'
import {IAccountInput, IUserInput} from '../../../shared/lib/typedefs'
import {_sendToTestMailbox} from '../routes/_test'

// tslint:disable-next-line
const debug = require('debug')('the-product:hooks')

const WELCOME_TEMPLATE = template(
  [
    'Hello <%= name %>,\n',
    `You're receiving this message because you registered an account for ${conf.displayName}.`,
    'Please follow the link below to verify your email address.',
    '\n<%= link %>\n',
    'If you did not register an account with us, you can ignore this email.',
    '\nThanks,',
    `The ${conf.displayName} Team`,
  ].join('\n'),
)

export async function sendWelcomeEmail(
  email: string,
  name: string,
  verificationKey: string,
): Promise<void> {
  const publicPath = `${conf.origin}/api`
  const sparkpost = new Sparkpost(conf.sparkpost.apiKey)
  const verifyLink = `${publicPath}/v1/users/verifications?key=${verificationKey}`

  debug('sending welcome email to', email, 'from', conf.sparkpost.fromAddress)

  const content: Sparkpost.CreateTransmission['content'] = {
    from: conf.sparkpost.fromAddress,
    subject: `Welcome to ${conf.displayName}! - Verify your email`,
    html: WELCOME_TEMPLATE({name, link: `<a href="${verifyLink}">${verifyLink}</a>`})
      .split('\n')
      .join('<br>'),
    text: WELCOME_TEMPLATE({name, link: verifyLink}),
  }

  _sendToTestMailbox(email, content)
  if (conf.sparkpost.sendToTestMailboxOnly) return

  await sparkpost.transmissions.send({
    options: {
      transactional: true,
    },
    content,
    recipients: [
      {
        address: {email, name},
        tags: ['welcome', 'email-verification'],
      },
    ],
  })
}

export async function runRegisterHooks(account: IAccountInput, user: IUserInput): Promise<void> {
  await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`, user.verificationKey!)
}
