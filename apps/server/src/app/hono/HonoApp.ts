import { type Context, type Next, Hono } from 'hono'
import { serve } from '@hono/node-server'

import type { RestResponse } from '@stardust/core/global/responses'

import { ENV } from '@/constants'
import { ProfileRouter } from './routers'
import { parseCookieHeader } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { setCookie } from 'hono/cookie'
import type { SupabaseClient } from '@supabase/supabase-js'

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient
  }
}

export class HonoApp {
  private readonly hono = new Hono()

  startServer() {
    this.registerMiddlewares()
    this.registerRoutes()
    serve(
      {
        fetch: this.hono.fetch,
        port: ENV.port,
      },
      (info) => {
        console.log(`Server is running on ${ENV.baseUrl}:${info.port} 🔥`)
      },
    )
  }

  private registerRoutes() {
    const profileRouter = new ProfileRouter(this)
    this.hono.route('/', profileRouter.registerRoutes())
  }

  private registerMiddlewares() {
    this.hono.use('*', this.createSupabaseClient())
  }

  private createSupabaseClient() {
    return async (c: Context, next: Next) => {
      const supabase = createServerClient(ENV.supabaseUrl, ENV.supabaseKey, {
        cookies: {
          getAll() {
            const cookies = parseCookieHeader(c.req.header('Cookie') ?? '')
            return cookies.map((cookie) => ({
              name: cookie.name,
              value: String(cookie.value),
            }))
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              // @ts-ignore
              setCookie(c, name, value, options),
            )
          },
        },
      })
      c.set('supabase', supabase)
      await next()
    }
  }

  sendRestResponse(response: RestResponse) {
    return response.body as Response
  }
}
