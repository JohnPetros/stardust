import { type Context, type Next, Hono } from 'hono'
import { serve } from '@hono/node-server'
import { setCookie } from 'hono/cookie'
import { serve as serveInngest } from 'inngest/hono'
import { parseCookieHeader } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import { ENV } from '@/constants'
import { ProfileRouter } from './routers'
import { inngest } from '@/queue/inngest/client'
import {
  ProfileFunctions,
  SpaceFunctions,
  ShopFunctions,
  RankingFunctions,
} from '@/queue/inngest/functions'
import { AuthRouter } from './routers/auth'
import { InngestAmqp } from '@/queue/inngest/InngestAmqp'

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient
    inngest: InngestAmqp<void>
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
    const authRouter = new AuthRouter(this)
    this.hono.route('/', profileRouter.registerRoutes())
    this.hono.route('/', authRouter.registerRoutes())
    this.registerInngestRoute()
  }

  private registerMiddlewares() {
    this.hono.use('*', this.createSupabaseClient())
    this.hono.use('*', this.createInngestAmqp())
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
    return async (context: Context, next: Next) => {
      const supabase = createServerClient(ENV.supabaseUrl, ENV.supabaseKey, {
        cookies: {
          getAll() {
            return parseCookieHeader(context.req.header('Cookie') ?? '')
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              // @ts-ignore
              setCookie(context, name, value, {
                ...options,
                maxAge: 60 * 60 * 24 * 400,
              }),
            )
          },
        },
      })
      context.set('supabase', supabase)
      await next()
    }
  }

  private createInngestAmqp() {
    return async (context: Context, next: Next) => {
      const inngest = new InngestAmqp()
      context.set('inngest', inngest)
      await next()
    }
  }
}
