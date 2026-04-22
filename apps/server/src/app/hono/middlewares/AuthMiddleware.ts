import type { Context, Next } from 'hono'

import { AuthenticateApiKeyUseCase } from '@stardust/core/auth/use-cases'
import { AuthError } from '@stardust/core/global/errors'

import { SupabaseApiKeysRepository } from '@/database'
import { NodeCryptoApiKeySecretProvider } from '@/provision/auth'
import { SupabaseAuthService } from '@/rest/services/SupabaseAuthService'
import {
  VerifyAuthenticationController,
  VerifyGodAccountController,
} from '@/rest/controllers/auth'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { HonoHttp } from '../HonoHttp'

export class AuthMiddleware {
  async verifyAuthentication(context: Context, next: Next) {
    const authService = new SupabaseAuthService(context.get('supabase'))
    const controller = new VerifyAuthenticationController(authService)
    const http = new HonoHttp(context, next)
    await controller.handle(http)
  }

  async verifyGodAccount(context: Context, next: Next) {
    const controller = new VerifyGodAccountController()
    const http = new HonoHttp(context, next)
    await controller.handle(http)
  }

  async verifyApiKeyAuthentication(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const apiKey = http.getHeader('X-Api-Key')

    if (!apiKey) {
      throw new AuthError('API key not provided')
    }

    const repository = new SupabaseApiKeysRepository(http.getSupabase())
    const secretProvider = new NodeCryptoApiKeySecretProvider()
    const useCase = new AuthenticateApiKeyUseCase(repository, secretProvider)

    const { userId } = await useCase.execute({ apiKey })

    const accountDto: AccountDto = {
      id: userId,
      email: '',
      name: '',
      isAuthenticated: true,
    }

    context.set('account', accountDto)
    await next()
  }
}
