import type { Context, Next } from 'hono'

import { AuthenticateApiKeyUseCase } from '@stardust/core/auth/use-cases'
import { AuthError } from '@stardust/core/global/errors'

import { DrizzleApiKeysRepository } from '@/database/drizzle/repositories/auth'
import { Id } from '@stardust/core/global/structures'
import { NodeCryptoApiKeySecretProvider } from '@/provision/auth'
import { SupabaseAuthService } from '@/rest/services/SupabaseAuthService'
import {
  VerifyAuthenticationController,
  VerifyGodAccountController,
} from '@/rest/controllers/auth'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { HonoHttp } from '../HonoHttp'
import type { RateLimitMiddleware } from './RateLimitMiddleware'

export class AuthMiddleware {
  verifyAuthentication = async (context: Context, next: Next) => {
    const accountDto = await this.fetchVerifiedAccount(context, next)
    this.setVerifiedAccountContext(context, accountDto)
    return this.continueApiKeyAuthentication(context, next)
  }

  private async fetchVerifiedAccount(context: Context, next: Next) {
    const authService = new SupabaseAuthService(context.get('supabase'))
    const controller = new VerifyAuthenticationController(authService)
    const http = new HonoHttp(context, next)
    const response = await controller.handle(http)
    return response.body
  }

  private setVerifiedAccountContext(context: Context, accountDto: AccountDto) {
    context.set('account', accountDto)
    context.set('databaseAccess', {
      kind: 'user',
      accountId: Id.create(String(accountDto.id)),
    })
  }

  verifyGodAccount = async (context: Context, next: Next) => {
    const controller = new VerifyGodAccountController()
    const http = new HonoHttp(context, async () => {
      context.set('databaseAccess', {
        kind: 'god',
        accountId: Id.create(String(context.get('account').id)),
      })
      await next()
    })
    await controller.handle(http)
  }

  verifyApiKeyAuthentication = async (context: Context, next: Next) => {
    const http = new HonoHttp(context, next)
    const apiKey = this.requireApiKey(http)
    const userId = await this.authenticateApiKey(http, apiKey)
    this.setApiKeyAccount(context, userId)
    return this.continueApiKeyAuthentication(context, next)
  }

  private requireApiKey(http: HonoHttp<Context>) {
    const apiKey = http.getHeader('X-Api-Key')
    if (!apiKey) throw new AuthError('A chave de API não foi informada')
    return apiKey
  }

  private async authenticateApiKey(http: HonoHttp<Context>, apiKey: string) {
    const repository = new DrizzleApiKeysRepository(http.getDatabase(), {
      kind: 'public',
    })
    const secretProvider = new NodeCryptoApiKeySecretProvider()
    const useCase = new AuthenticateApiKeyUseCase(repository, secretProvider)
    return (await useCase.execute({ apiKey })).userId
  }

  private setApiKeyAccount(context: Context, userId: string) {
    context.set('account', this.createApiKeyAccount(userId))
    context.set('databaseAccess', { kind: 'user', accountId: Id.create(userId) })
  }

  private createApiKeyAccount(userId: string): AccountDto {
    return {
      id: userId,
      email: '',
      name: '',
      isAuthenticated: true,
    }
  }

  private continueApiKeyAuthentication(context: Context, next: Next) {
    const rateLimiter = (context as Context<any>).get('rateLimiter') as
      | RateLimitMiddleware
      | undefined
    if (rateLimiter) return rateLimiter.limitByAccount(context, next)
    return next()
  }
}
