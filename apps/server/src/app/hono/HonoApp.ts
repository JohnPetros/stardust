import { type Context, type Next, Hono } from 'hono'
import { serve } from '@hono/node-server'
import { setCookie } from 'hono/cookie'
import { serve as serveInngest } from 'inngest/hono'
import { parseCookieHeader } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { RestResponse } from '@stardust/core/global/responses'

import { ENV } from '@/constants'
import { ProfileRouter } from './routers'
import { inngest } from '@/queue/inngest/client'
import {
  ProfileFunctions,
  SpaceFunctions,
  ShopFunctions,
  RankingFunctions,
} from '@/queue/inngest/functions'

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
        console.log(`🏢 Server is running on ${ENV.baseUrl}:${info.port}`)
      },
    )
  }

  private registerRoutes() {
    const profileRouter = new ProfileRouter(this)
    this.hono.route('/', profileRouter.registerRoutes())
    this.registerInngestRoute()
  }

  private registerMiddlewares() {
    this.hono.use('*', this.createSupabaseClient())
  }

  private registerInngestRoute() {
    this.hono.on(['GET', 'PUT', 'POST'], '/inngest', (context) => {
      const supabase = context.get('supabase')
      const profileFunctions = new ProfileFunctions(inngest)
      const spaceFunctions = new SpaceFunctions(inngest)
      const shopFunctions = new ShopFunctions(inngest)
      const rankingFunctions = new RankingFunctions(inngest)

      return serveInngest({
        client: inngest,
        functions: [
          ...profileFunctions.getFunctions(supabase),
          ...spaceFunctions.getFunctions(supabase),
          ...shopFunctions.getFunctions(supabase),
          ...rankingFunctions.getFunctions(supabase),
        ],
      })(context)
    })
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
