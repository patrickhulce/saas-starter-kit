import {IQueryTransaction} from 'klay'

import {logger, verificationExecutor} from '../../../shared/lib'
import {IAccount, IUser, VerificationType} from '../../../shared/lib/typedefs'
import {sendWelcomeEmail} from '../email/email'

const log = logger('hooks')

export async function runRegisterHooks(
  account: IAccount,
  user: IUser,
  transaction: IQueryTransaction,
): Promise<void> {
  log('running register hooks')
  const verification = await verificationExecutor.create(
    {
      userId: user.id,
      type: VerificationType.Email,
      consumed: false,
      meta: {},
    },
    {transaction},
  )

  await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`, verification.key!)
}
