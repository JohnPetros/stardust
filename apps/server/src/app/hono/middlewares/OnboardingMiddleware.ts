import type { Context, Next } from 'hono'
import { AuthError } from '@stardust/core/global/errors'
import { Text } from '@stardust/core/global/structures'
import type { Email, Id, Name } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { NodeOnboardingReceiptProvider } from '@/provision/auth/NodeOnboardingReceiptProvider'

type Attempt = { accountId: Id; email: Email; name: Name; expiresAt: Date }

declare module 'hono' {
  interface ContextVariableMap {
    onboardingAttempt: Attempt
  }
}

export class OnboardingMiddleware {
  async authorizeAttempt(context: Context, next: Next): Promise<void> {
    const receipt = context.req.header('X-Onboarding-Receipt')
    if (!receipt) throw new AuthError('Tentativa de cadastro ausente')
    const attempt = await new NodeOnboardingReceiptProvider(
      ENV.onboardingReceiptSecret,
    ).verify(Text.create(receipt))
    context.set('onboardingAttempt', attempt)
    context.set('databaseAccess', { kind: 'user', accountId: attempt.accountId })
    await next()
  }
}
