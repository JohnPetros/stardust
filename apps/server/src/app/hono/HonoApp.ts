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
import { inngest } from '@/queue/inngest/inngest'
import {
  ProfileFunctions,
  SpaceFunctions,
  ShopFunctions,
  RankingFunctions,
  NotificationFunctions,
  StorageFunctions,
} from '@/queue/inngest/functions'
import { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import {
  AuthRouter,
  ProfileRouter,
  SpaceRouter,
  ShopRouter,
  ChallengingRouter,
  DocumentationRouter,
  RankingRouter,
  LessonRouter,
  StorageRouter,
  NotificationRouter,
} from './routers'
import { ForumRouter } from './routers/forum'
import { PlaygroundRouter } from './routers/playground/PlaygroundRouter'
import { SentryTelemetryProvider } from '@/provision/monitor'
import { DiscordNotificationService } from '@/rest/services'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { HonoServer } from './HonoServer'

type SupabaseSession = User & { sub: string }

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient
    inngest: InngestAmqp<void>
  }
}

export class HonoApp {
  private readonly hono = new Hono()
  private readonly telemetryProvider = new SentryTelemetryProvider()
  private readonly notificationService = new DiscordNotificationService(
    new AxiosRestClient(ENV.discordWebhookUrl),
  )

  startServer() {
    this.setUpCors()
    this.registerMiddlewares()
    this.registerRoutes()
    this.setUpErrorHandler()

    const server = serve(
      {
        fetch: this.hono.fetch,
        port: ENV.port,
      },
      (info) => {
        console.log(`🏢 Server is running on ${ENV.baseUrl}:${info.port}`)
      },
    )

    return new HonoServer(this.hono, server)
  }

  private setUpErrorHandler() {
    this.hono.onError(async (error, context) => {
      console.error('Error:', error.message)

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

      if (ENV.mode !== 'development') {
        this.telemetryProvider.trackError(error)
        await this.notificationService.sendErrorNotification('server', error.message)
      }

      return context.json(
        {
          title: 'Unexpected Server Error',
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
    const lessonRouter = new LessonRouter(this)
    const shopRouter = new ShopRouter(this)
    const challengingRouter = new ChallengingRouter(this)
    const rankingRouter = new RankingRouter(this)
    const forumRouter = new ForumRouter(this)
    const playgroundRouter = new PlaygroundRouter(this)
    const documentationRouter = new DocumentationRouter(this)
    const storageRouter = new StorageRouter(this)
    const notificationRouter = new NotificationRouter(this)

    this.hono.get('/', (context) => {
      return context.json({ message: 'Everything is working!' })
    })
    this.registerInngestRoute()
    this.hono.route('/', authRouter.registerRoutes())
    this.hono.route('/', profileRouter.registerRoutes())
    this.hono.route('/', spaceRouter.registerRoutes())
    this.hono.route('/', lessonRouter.registerRoutes())
    this.hono.route('/', shopRouter.registerRoutes())
    this.hono.route('/', challengingRouter.registerRoutes())
    this.hono.route('/', rankingRouter.registerRoutes())
    this.hono.route('/', forumRouter.registerRoutes())
    this.hono.route('/', playgroundRouter.registerRoutes())
    this.hono.route('/', documentationRouter.registerRoutes())
    this.hono.route('/', storageRouter.registerRoutes())
    this.hono.route('/', notificationRouter.registerRoutes())
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
      const notificationFunctions = new NotificationFunctions(inngest)

      return serveInngest({
        client: inngest,
        functions: [
          ...profileFunctions.getFunctions(supabase),
          ...spaceFunctions.getFunctions(supabase),
          ...shopFunctions.getFunctions(supabase),
          ...rankingFunctions.getFunctions(supabase),
          ...storageFunctions.getFunctions(),
          ...notificationFunctions.getFunctions(),
        ],
      })(context)
    })
  }

  private setAccount(accessToken: string, context: Context) {
    const session = jwtDecode<SupabaseSession>(accessToken)
    const accountDto: AccountDto = {
      id: session.sub,
      email: session.user_metadata.email,
      name: session.user_metadata.name,
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
