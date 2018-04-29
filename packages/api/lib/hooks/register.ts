import {template} from 'lodash'
import * as Sparkpost from 'sparkpost'
import conf from '../../../shared/lib/conf'

const WELCOME_TEMPLATE = template(
  [
    'Hello <%= name %>,',
    'Please follow this link to verify your email address.',
    '<%= link %>',
    'If you did not register this address, you can ignore this email.',
    'Thanks,',
    'The THE_PRODUCT_DISPLAY_NAME Team',
  ].join('\n'),
)

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const sparkpost = new Sparkpost(conf.sparkpost.apiKey)
  const emailToVerify = conf.sparkpost.sendToSink ? `${email}.sink.sparkpostmail.com` : email
  // TODO: make this a real verify link
  const verifyLink = 'http://THE_DOMAIN/'

  await sparkpost.transmissions.send({
    options: {
      transactional: true,
    },
    content: {
      from: conf.sparkpost.fromAddress,
      subject: 'Welcome to THE_PRODUCT_DISPLAY_NAME! - Verify your email',
      html: WELCOME_TEMPLATE({name, link: `<a href="${verifyLink}">${verifyLink}</a>`}),
      text: WELCOME_TEMPLATE({name, link: verifyLink}),
    },
    recipients: [
      {
        address: {email: emailToVerify, name},
        tags: ['welcome', 'email-verification'],
      },
    ],
  })
}
