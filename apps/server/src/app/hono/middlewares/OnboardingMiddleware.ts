import type { Context, Next } from 'hono'
import { AuthError } from '@stardust/core/global/errors'
import { Id, Text } from '@stardust/core/global/structures'
import type { Email, Name } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { NodeOnboardingReceiptProvider } from '@/provision/auth/NodeOnboardingReceiptProvider'
import { SupabaseAuthService } from '@/rest/services/SupabaseAuthService'

type Attempt = { accountId: Id; email: Email; name: Name; expiresAt: Date }
export type ProfileStreamAuthorization = { accountId: Id; expiresAt: Date | null }

declare module 'hono' {
  interface ContextVariableMap {
    onboardingAttempt: Attempt
    profileStreamAuthorization: ProfileStreamAuthorization
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

  private async verifyBearerAccount(context: Context, bearer: string) {
    const response = await new SupabaseAuthService(context.get('supabase')).fetchAccount()
    if (
      response.isFailure ||
      !response.body.isAuthenticated ||
      !response.body.id ||
      !/^Bearer\s+\S+$/i.test(bearer)
    )
      throw new AuthError('Conta não autorizada')
    return response
  }

  private getBearerExpiry(bearer: string): Date {
    const token = bearer.split(/\s+/)[1]
    let expiresAt: Date
    try {
      const exp = this.decodeBearerExpiryClaim(token)
      if (typeof exp !== 'number' || !Number.isFinite(exp) || exp * 1000 <= Date.now())
        throw new AuthError('Conta não autorizada')
      expiresAt = new Date(exp * 1000)
    } catch {
      throw new AuthError('Conta não autorizada')
    }
    return expiresAt
  }

  private decodeBearerExpiryClaim(token: string): unknown {
    const claims = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8'),
    )
    return claims.exp
  }

  private async authorizeBearerProfileStream(
    context: Context,
    next: Next,
    bearer: string,
  ): Promise<void> {
    const response = await this.verifyBearerAccount(context, bearer)
    const accountId = Id.create(String(response.body.id))
    const expiresAt = this.getBearerExpiry(bearer)
    context.set('account', response.body)
    context.set('databaseAccess', { kind: 'user', accountId })
    context.set('profileStreamAuthorization', { accountId, expiresAt })
    const limiter = context.get('rateLimiter')
    if (limiter) {
      await limiter.limitByAccount(context, next)
      return
    }
    await next()
  }

  private async authorizeReceiptProfileStream(
    context: Context,
    next: Next,
  ): Promise<void> {
    const receipt = context.req.header('X-Onboarding-Receipt')
    if (!receipt) throw new AuthError('Tentativa de cadastro ausente')
    const attempt = await new NodeOnboardingReceiptProvider(
      ENV.onboardingReceiptSecret,
    ).verify(Text.create(receipt))
    context.set('databaseAccess', { kind: 'user', accountId: attempt.accountId })
    context.set('profileStreamAuthorization', {
      accountId: attempt.accountId,
      expiresAt: attempt.expiresAt,
    })
    await next()
  }

  authorizeProfileStream = async (context: Context, next: Next): Promise<void> => {
    const bearer = context.req.header('Authorization')
    if (bearer) {
      await this.authorizeBearerProfileStream(context, next, bearer)
      return
    }
    await this.authorizeReceiptProfileStream(context, next)
  }
}
