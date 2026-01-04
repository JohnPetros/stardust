import type { Context, Next } from 'hono'

import { SupabaseAuthService } from '@/rest/services/SupabaseAuthService'
import {
  VerifyAuthenticationController,
  VerifyGodAccountController,
} from '@/rest/controllers/auth'
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
}
