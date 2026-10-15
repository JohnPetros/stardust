import { DrizzleOutboxRepository } from '@/database/drizzle/repositories/global/DrizzleOutboxRepository'
import { InngestEventPublisher } from '@/queue/inngest/InngestEventPublisher'
import { OutboxDispatcher } from '@/queue/inngest/OutboxDispatcher'
import { DispatchOutboxEventsJob } from '@/queue/jobs/global/DispatchOutboxEventsJob'
import { type Context, type Next, Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { serve as serveInngest } from 'inngest/hono'
import { type SupabaseClient, type User, createClient } from '@supabase/supabase-js'
import { ZodError } from 'zod'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import type { DatabaseAccess } from '@/database/drizzle/DatabaseAccess'
import { Id } from '@stardust/core/global/structures'

import {
  AuthError,
  ConflictError,
  NotAllowedError,
  NotFoundError,
  ValidationError,
} from '@stardust/core/global/errors'
import { AppError } from '@stardust/core/global/errors'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type {
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { ENV } from '@/constants'
import { inngest } from '@/queue/inngest/inngest'
import {
  AnalyticsFunctions,
  ProfileFunctions,
  SpaceFunctions,
  ShopFunctions,
  RankingFunctions,
  NotificationFunctions,
  StorageFunctions,
  ChallengingFunctions,
  LessonFunctions,
  ManualFunctions,
} from '@/queue/inngest/functions'
import { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import { SentryTelemetryProvider } from '@/provision/telemetry'
import { IORedisRateLimiterProvider } from '@/provision/rate-limiter'
import { DiscordNotificationService } from '@/rest/services'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { HonoServer } from './HonoServer'

import {
  AuthRouter,
  ProfileRouter,
  SpaceRouter,
  ShopRouter,
  ChallengingRouter,
  ManualRouter,
  RankingRouter,
  LessonRouter,
  StorageRouter,
  NotificationRouter,
  ConversationRouter,
  ReportingRouter,
  McpRouter,
  HealthRouter,
} from './routers'
import { ForumRouter } from './routers/forum'
import { PlaygroundRouter } from './routers/playground/PlaygroundRouter'
import { RateLimitMiddleware } from './middlewares'
import type { RateLimitClock } from './middlewares/RateLimitMiddleware'

declare module 'hono' {
  interface ContextVariableMap {
    databaseAccess: DatabaseAccess
    account: AccountDto
    supabase: SupabaseClient
    inngest: InngestAmqp<void>
    rateLimiter: RateLimitMiddleware
  }
}

export class HonoApp {
  readonly hono = new Hono()
  private readonly telemetryProvider: TelemetryProvider
  private readonly rateLimiterMiddleware: RateLimitMiddleware
  private readonly notificationService = new DiscordNotificationService(
    new AxiosRestClient(ENV.discordWebhookUrl),
  )

  constructor(
    rateLimiterProvider: RateLimiterProvider = new IORedisRateLimiterProvider(),
    telemetryProvider: TelemetryProvider = new SentryTelemetryProvider(),
    rateLimitClock?: RateLimitClock,
    trustedProxyCidrs: readonly string[] = ENV.trustedProxyCidrs,
  ) {
    this.telemetryProvider = telemetryProvider
    this.rateLimiterMiddleware = new RateLimitMiddleware({
      rateLimiterProvider,
      telemetryProvider,
      clock: rateLimitClock,
      trustedProxyCidrs,
    })
  }

  async startServer(port = ENV.port) {
    this.setup()
    const server = await this.startNodeServer(this.serverOptions(port))
    this.startOutboxDispatcher(server)
    return new HonoServer(this.hono, server)
  }

  private serverOptions(port: number): StartNodeServerParams {
    return { serve, fetch: this.hono.fetch, port, mode: ENV.mode, baseUrl: ENV.baseUrl }
  }

  private startOutboxDispatcher(server: ServerType): void {
    const dispatcher = this.createOutboxDispatcher()
    this.registerOutboxShutdown(server, dispatcher)
    dispatcher.start()
  }

  private createOutboxDispatcher() {
    const repository = new DrizzleOutboxRepository(DrizzleClient.getInstance(), {
      kind: 'system',
    })
    const job = new DispatchOutboxEventsJob(repository, new InngestEventPublisher())
    return new OutboxDispatcher(job, () => this.reportOutboxFailure())
  }

  private reportOutboxFailure() {
    this.telemetryProvider.trackError(new Error('Outbox dispatch failed'))
  }

  private registerOutboxShutdown(server: ServerType, dispatcher: OutboxDispatcher) {
    const remove = DrizzleClient.registerShutdownHook(() => dispatcher.stop())
    server.once('close', () => {
      void dispatcher.stop().finally(remove)
    })
  }

  setup() {
    DrizzleClient.create(ENV.databaseUrl)
    this.setUpCors()
    this.registerMiddlewares()
    this.registerRoutes()
    this.setUpErrorHandler()
  }

  setUpErrorHandler() {
    this.hono.onError((error, context) => this.handleError(error, context))
  }

  private async handleError(error: Error, context: Context): Promise<Response> {
    if (error instanceof AppError) return this.respondToAppError(error, context)
    console.error('Error:', error)
    if (error instanceof ZodError) return this.respondToZodError(error, context)
    await this.reportUnexpectedError(error)
    return this.respondToUnexpectedError(context)
  }

  private respondToZodError(error: ZodError, context: Context) {
    return context.json(
      { title: 'Erro de validação', message: error.issues },
      HTTP_STATUS_CODE.badRequest,
    )
  }

  private async reportUnexpectedError(error: Error) {
    if (ENV.mode === 'development') return
    this.telemetryProvider.trackError(error)
    await this.notificationService.sendErrorNotification('server', error.message)
  }

  private respondToUnexpectedError(context: Context) {
    return context.json(
      {
        title: 'Erro interno do servidor',
        message: 'Ocorreu um erro interno. Tente novamente mais tarde.',
      },
      HTTP_STATUS_CODE.serverError,
    )
  }

  private respondToAppError(error: AppError, context: Context): Response {
    console.error('Error title:', error.title)
    console.error('Error message:', error.message)
    return context.json(
      { title: error.title, message: error.message },
      this.appErrorStatus(error),
    )
  }

  private appErrorStatus(error: AppError) {
    if (error instanceof AuthError) return HTTP_STATUS_CODE.unauthorized
    if (error instanceof NotFoundError) return HTTP_STATUS_CODE.notFound
    if (error instanceof ConflictError) return HTTP_STATUS_CODE.conflict
    return this.validationErrorStatus(error)
  }

  private validationErrorStatus(error: AppError) {
    if (error instanceof ValidationError) return HTTP_STATUS_CODE.badRequest
    if (error instanceof NotAllowedError) return HTTP_STATUS_CODE.notAllowed
    return HTTP_STATUS_CODE.serverError
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

  private createRouters() {
    return {
      ...this.createLearningRouters(),
      ...this.createCommunityRouters(),
      ...this.createServiceRouters(),
      ...this.createOperationalRouters(),
    }
  }

  private createLearningRouters() {
    return {
      profileRouter: new ProfileRouter(this),
      authRouter: new AuthRouter(this),
      spaceRouter: new SpaceRouter(this),
      lessonRouter: new LessonRouter(this),
    }
  }

  private createCommunityRouters() {
    return {
      shopRouter: new ShopRouter(this),
      challengingRouter: new ChallengingRouter(this),
      rankingRouter: new RankingRouter(this),
      forumRouter: new ForumRouter(this),
    }
  }

  private createServiceRouters() {
    return {
      playgroundRouter: new PlaygroundRouter(this),
      manualRouter: new ManualRouter(this),
      storageRouter: new StorageRouter(this),
      notificationRouter: new NotificationRouter(this),
    }
  }

  private createOperationalRouters() {
    return {
      conversationRouter: new ConversationRouter(this),
      reportingRouter: new ReportingRouter(this),
      mcpRouter: new McpRouter(this),
      healthRouter: new HealthRouter(this),
    }
  }

  registerRoutes() {
    const routers = this.createRouters()
    this.registerRootRoutes()
    this.mountAccountAndLearningRoutes(routers)
    this.mountContentAndServiceRoutes(routers)
  }

  private registerRootRoutes() {
    this.hono.get('/live', (context) => {
      return context.json({ status: 'UP' })
    })
    this.hono.get('/', (context) => {
      return context.redirect('/health', HTTP_STATUS_CODE.redirect)
    })
    this.registerInngestRoute()
  }

  private mountAccountAndLearningRoutes(routers: ReturnType<HonoApp['createRouters']>) {
    this.mountIdentityRoutes(routers)
    this.mountLearningRoutes(routers)
  }

  private mountIdentityRoutes(routers: ReturnType<HonoApp['createRouters']>) {
    this.mountRouters([
      routers.healthRouter,
      routers.authRouter,
      routers.profileRouter,
      routers.spaceRouter,
    ])
  }

  private mountLearningRoutes(routers: ReturnType<HonoApp['createRouters']>) {
    this.mountRouters([
      routers.lessonRouter,
      routers.shopRouter,
      routers.challengingRouter,
      routers.rankingRouter,
    ])
  }

  private mountContentAndServiceRoutes(routers: ReturnType<HonoApp['createRouters']>) {
    this.mountContentRoutes(routers)
    this.mountServiceRoutes(routers)
  }

  private mountContentRoutes(routers: ReturnType<HonoApp['createRouters']>) {
    this.mountRouters([
      routers.forumRouter,
      routers.playgroundRouter,
      routers.manualRouter,
      routers.storageRouter,
    ])
  }

  private mountServiceRoutes(routers: ReturnType<HonoApp['createRouters']>) {
    this.mountRouters([
      routers.notificationRouter,
      routers.conversationRouter,
      routers.reportingRouter,
      routers.mcpRouter,
    ])
  }

  private mountRouters(routers: { registerRoutes(): Hono }[]) {
    for (const router of routers) this.hono.route('/', router.registerRoutes())
  }

  registerMiddlewares() {
    this.registerRateLimiter()
    this.hono.use('*', this.createSupabaseClient())
    this.hono.use('*', this.createInngestAmqp())
  }

  private registerRateLimiter() {
    this.hono.use('*', async (context, next) => {
      context.set('rateLimiter', this.rateLimiterMiddleware)
      await next()
    })
    this.hono.use(
      '*',
      this.rateLimiterMiddleware.limitByIp.bind(this.rateLimiterMiddleware),
    )
  }

  registerInngestRoute() {
    this.hono.on(['GET', 'PUT', 'POST'], '/inngest', (context) =>
      this.handleInngest(context),
    )
  }

  private handleInngest(context: Context) {
    const functions = this.createInngestFunctions(DrizzleClient.getInstance())
    return serveInngest({ client: inngest, functions })(
      context as Context<any, any, Record<string, never>>,
    )
  }

  private createInngestFunctions(database: ReturnType<typeof DrizzleClient.getInstance>) {
    return [
      ...this.createAccountFunctions(database),
      ...this.createSpaceFunctions(database),
      ...this.createContentFunctions(database),
    ]
  }

  private createAccountFunctions(database: ReturnType<typeof DrizzleClient.getInstance>) {
    return [
      ...new ProfileFunctions(inngest).getFunctions(database),
      ...new AnalyticsFunctions(inngest).getFunctions(),
    ]
  }

  private createSpaceFunctions(database: ReturnType<typeof DrizzleClient.getInstance>) {
    return [
      ...new SpaceFunctions(inngest).getFunctions(database),
      ...new ShopFunctions(inngest).getFunctions(database),
      ...new RankingFunctions(inngest).getFunctions(database),
    ]
  }

  private createContentFunctions(database: ReturnType<typeof DrizzleClient.getInstance>) {
    return [
      ...this.createStorageFunctions(database),
      ...this.createLessonFunctions(database),
    ]
  }

  private createStorageFunctions(database: ReturnType<typeof DrizzleClient.getInstance>) {
    return [
      ...new StorageFunctions(inngest).getFunctions(database),
      ...new NotificationFunctions(inngest).getFunctions(),
      ...new ChallengingFunctions(inngest).getFunctions(database),
    ]
  }

  private createLessonFunctions(database: ReturnType<typeof DrizzleClient.getInstance>) {
    return [
      ...new ManualFunctions(inngest).getFunctions(),
      ...new LessonFunctions(inngest).getFunctions(database),
    ]
  }

  private createSupabaseClient() {
    return (context: Context, next: Next) => this.configureSupabase(context, next)
  }

  private async configureSupabase(context: Context, next: Next) {
    const accessToken = context.req.header('Authorization')?.split(' ')[1]
    const supabase = this.createRequestSupabase(accessToken)
    this.setSupabaseContext(context, supabase)
    await this.authenticateRequest(context, supabase, accessToken)
    await next()
  }

  private setSupabaseContext(context: Context, supabase: SupabaseClient) {
    context.set('supabase', supabase)
    context.set('databaseAccess', { kind: 'public' })
  }

  private createRequestSupabase(accessToken?: string) {
    if (!accessToken) return createClient(ENV.supabaseUrl, ENV.supabaseKey)
    return createClient(ENV.supabaseUrl, ENV.supabaseKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    })
  }

  private async authenticateRequest(
    context: Context,
    supabase: SupabaseClient,
    accessToken?: string,
  ) {
    if (!accessToken || context.req.path.startsWith('/mcp')) return
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (!error && data.user) this.setAuthenticatedAccount(context, data.user)
  }

  private setAuthenticatedAccount(context: Context, user: User) {
    context.set('account', this.accountFromUser(user))
    context.set('databaseAccess', { kind: 'user', accountId: Id.create(user.id) })
  }

  private accountFromUser(user: User): AccountDto {
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata.name ?? '',
      isAuthenticated: true,
    }
  }

  private createInngestAmqp() {
    return async (context: Context, next: Next) => {
      const inngest = new InngestAmqp()
      context.set('inngest', inngest)
      await next()
    }
  }

  async startNodeServer(params: StartNodeServerParams) {
    return this.tryPort(params, 0)
  }

  private async tryPort(
    params: StartNodeServerParams,
    offset: number,
  ): Promise<ServerType> {
    this.assertPortAttempts(offset)
    return this.listenOnPort(params, params.port + offset).catch((error) =>
      this.retryPort(error, params, offset),
    )
  }

  private retryPort(
    error: unknown,
    params: StartNodeServerParams,
    offset: number,
  ): Promise<ServerType> {
    this.assertPortRetry(error, params.mode)
    this.reportBusyPort(params.port + offset)
    return this.tryPort(params, offset + 1)
  }

  private reportBusyPort(port: number) {
    console.warn(`Port ${port} is already in use. Trying ${port + 1}.`)
  }

  private listenOnPort(params: StartNodeServerParams, port: number) {
    return new NodeServerStartup({ ...params, port }).start()
  }

  private assertPortAttempts(offset: number) {
    if (offset < MAX_PORT_ATTEMPTS) return
    throw new Error(
      `Não foi possível encontrar uma porta disponível após ${MAX_PORT_ATTEMPTS} tentativas.`,
    )
  }

  private assertPortRetry(error: unknown, mode: StartNodeServerParams['mode']) {
    if (!this.isAddressInUseError(error) || mode !== 'development') throw error
  }

  private isAddressInUseError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error && error.code === 'EADDRINUSE'
  }
}

const MAX_PORT_ATTEMPTS = 10

type ServeFn = typeof import('@hono/node-server').serve
type ServeOptions = Parameters<ServeFn>[0]
type ListeningListener = Parameters<ServeFn>[1]
type ServerType = ReturnType<ServeFn>

type StartNodeServerParams = {
  serve: ServeFn
  fetch: ServeOptions['fetch']
  port: number
  mode: 'development' | 'production' | 'test'
  baseUrl: string
}

class NodeServerStartup {
  private server: ServerType | null = null
  private settled = false
  private resolve!: (server: ServerType) => void
  private reject!: (error: unknown) => void

  constructor(private readonly options: Omit<StartNodeServerParams, 'mode'>) {}

  start(): Promise<ServerType> {
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.listen()
    })
  }

  private listen() {
    try {
      this.server = this.createServer()
      this.server.once('error', this.handleStartupError)
    } catch (error) {
      this.reject(error)
    }
  }

  private createServer() {
    const { serve, fetch, port } = this.options
    return serve({ fetch, port }, this.handleListening)
  }

  private settle(callback: () => void) {
    if (this.settled) return
    this.settled = true
    this.server?.off('error', this.handleStartupError)
    callback()
  }

  private readonly handleStartupError = (error: Error) => {
    this.settle(() => this.rejectStartup(error))
  }

  private rejectStartup(error: Error) {
    this.server?.close()
    this.reject(error)
  }

  private readonly handleListening: NonNullable<ListeningListener> = () => {
    this.settle(() => this.resolveListening())
  }

  private resolveListening() {
    console.log(`🏢 Server is running on ${this.options.baseUrl}`)
    this.resolve(this.server as ServerType)
  }
}
