import { type Context, type Next, Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { serve as serveInngest } from 'inngest/hono'
import { type SupabaseClient, type User, createClient } from '@supabase/supabase-js'
import { ZodError } from 'zod'
import { jwtDecode } from 'jwt-decode'

import {
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@stardust/core/global/errors'
import { AppError } from '@stardust/core/global/errors'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'

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
import {
  AuthRouter,
  ProfileRouter,
  SpaceRouter,
  ShopRouter,
  ChallengingRouter,
} from './routers'

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient
    inngest: InngestAmqp<void>
  }
}

export class HonoApp {
  private readonly hono = new Hono()

  startServer() {
    this.setUpCors()
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
      console.error(error)

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

  private setUpCors() {
    this.hono.use(
      '*',
      cors({
        origin: '*',
        exposeHeaders: Object.values(HTTP_HEADERS),
      }),
    )
  }

  private registerRoutes() {
    const profileRouter = new ProfileRouter(this)
    const authRouter = new AuthRouter(this)
    const spaceRouter = new SpaceRouter(this)
    const shopRouter = new ShopRouter(this)
    const challengingRouter = new ChallengingRouter(this)

    this.hono.get('/', (context) => {
      return context.json({ message: 'Everything is working!' })
    })
    this.registerInngestRoute()
    this.hono.route('/', authRouter.registerRoutes())
    this.hono.route('/', profileRouter.registerRoutes())
    this.hono.route('/', spaceRouter.registerRoutes())
    this.hono.route('/', shopRouter.registerRoutes())
    this.hono.route('/', challengingRouter.registerRoutes())
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

  private setAccount(accessToken: string, context: Context) {
    const session = jwtDecode<User>(accessToken)
    const accountDto: AccountDto = {
      id: session.user_metadata.sub,
      email: session.user_metadata.email,
      isAuthenticated: session.user_metadata.email_verified,
    }
    context.set('account', accountDto)
  }

  private createSupabaseClient() {
    return async (context: Context, next: Next) => {
      const accessToken = context.req.header('Authorization')?.split(' ')[1]
      const supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey, {
        global: {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
          },
        },
      })
      context.set('supabase', supabase)
      if (accessToken) this.setAccount(accessToken, context)
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
