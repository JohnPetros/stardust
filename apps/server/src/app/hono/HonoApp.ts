import { type Context, type Next, Hono } from 'hono'
import { serve } from '@hono/node-server'
import { setCookie } from 'hono/cookie'
import { serve as serveInngest } from 'inngest/hono'
import { parseCookieHeader } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ZodError } from 'zod'

import { ENV } from '@/constants'
import { inngest } from '@/queue/inngest/client'
import {
  ProfileFunctions,
  SpaceFunctions,
  ShopFunctions,
  RankingFunctions,
  StorageFunctions,
} from '@/queue/inngest/functions'
import { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import { AuthRouter, ProfileRouter, SpaceRouter, ShopRouter } from './routers'
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@stardust/core/global/errors'
import { AppError } from '@stardust/core/global/errors'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

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
    this.setUpErrorHandler()
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

  private setUpErrorHandler() {
    this.hono.onError((error, context) => {
      if (error instanceof AppError) {
        console.error('Error title:', error.title)
        console.error('Error message:', error.message)

        const response = {
          title: error.title,
          message: error.message,
        }

        if (error instanceof AuthError)
          return context.json(response, HTTP_STATUS_CODE.unauthorized)

        if (error instanceof NotFoundError)
          return context.json(response, HTTP_STATUS_CODE.notFound)

        if (error instanceof ConflictError)
          return context.json(response, HTTP_STATUS_CODE.conflict)

        if (error instanceof ValidationError)
          return context.json(response, HTTP_STATUS_CODE.badRequest)

        return context.json(response, HTTP_STATUS_CODE.serverError)
      }

      console.error(error)

      if (error instanceof ZodError)
        return context.json(
          { title: 'Validation Error', message: error.issues },
          HTTP_STATUS_CODE.badRequest,
        )

      return context.json(
        {
          title: 'Server Error',
          message: error.message,
        },
        HTTP_STATUS_CODE.serverError,
      )
    })
  }

  private registerRoutes() {
    const profileRouter = new ProfileRouter(this)
    const authRouter = new AuthRouter(this)
    const spaceRouter = new SpaceRouter(this)
    const shopRouter = new ShopRouter(this)

    this.hono.route('/', profileRouter.registerRoutes())
    this.hono.route('/', authRouter.registerRoutes())
    this.hono.route('/', spaceRouter.registerRoutes())
    this.hono.route('/', shopRouter.registerRoutes())
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
      const storageFunctions = new StorageFunctions(inngest)

      return serveInngest({
        client: inngest,
        functions: [
          ...profileFunctions.getFunctions(supabase),
          ...spaceFunctions.getFunctions(supabase),
          ...shopFunctions.getFunctions(supabase),
          ...rankingFunctions.getFunctions(supabase),
          ...storageFunctions.getFunctions(),
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
                maxAge: 60 * 60 * 24 * 400, // 400 days
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
