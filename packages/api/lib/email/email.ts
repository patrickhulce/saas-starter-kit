import {template} from 'lodash'
import * as Sparkpost from 'sparkpost'

import {logger} from '../../../shared/lib'
import conf from '../../../shared/lib/conf'
import {_sendToTestMailbox} from '../routes/_test'

const log = logger('email')

const WELCOME_TEMPLATE = template(
  [
    'Hello <%= name %>,\n',
    `You're receiving this message because you registered an account for ${conf.displayName}.`,
    'Please follow the link below to verify your email address.',
    '\n<%= link %>\n',
    'Thanks,',
    `The ${conf.displayName} Team`,
  ].join('\n'),
)

const PASSWORD_RESET_TEMPLATE = template(
  [
    'Hello <%= name %>,\n',
    `You're receiving this message because you requested a password reset for ${conf.displayName}.`,
    'Please follow the link below to reset your password.',
    '\n<%= link %>\n',
    'Best,',
    `The ${conf.displayName} Team`,
  ].join('\n'),
)

async function sendEmail(
  email: string,
  name: string,
  content: Sparkpost.CreateTransmission['content'],
  tags: string[] = [],
): Promise<void> {
  const sparkpost = new Sparkpost(conf.sparkpost.apiKey)
  log('sending email to', email, 'from', conf.sparkpost.fromAddress)

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
        tags,
      },
    ],
  })
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  verificationKey: string,
): Promise<void> {
  const publicPath = `${conf.origin}/api`
  const verifyLink = `${publicPath}/v1/users/verifications?key=${verificationKey}`

  await sendEmail(
    email,
    name,
    {
      from: conf.sparkpost.fromAddress,
      subject: `Welcome to ${conf.displayName}! - Verify your email`,
      html: WELCOME_TEMPLATE({name, link: `<a href="${verifyLink}">${verifyLink}</a>`})
        .split('\n')
        .join('<br>'),
      text: WELCOME_TEMPLATE({name, link: verifyLink}),
    },
    ['welcome', 'email-verification'],
  )
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  verificationKey: string,
): Promise<void> {
  const verifyLink = `${conf.origin}/login?reset-password-key=${verificationKey}`

  await sendEmail(
    email,
    name,
    {
      from: conf.sparkpost.fromAddress,
      subject: `Your Password Reset - ${conf.displayName}`,
      html: PASSWORD_RESET_TEMPLATE({name, link: `<a href="${verifyLink}">${verifyLink}</a>`})
        .split('\n')
        .join('<br>'),
      text: PASSWORD_RESET_TEMPLATE({name, link: verifyLink}),
    },
    ['password-reset'],
  )
}
