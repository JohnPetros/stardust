import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { Mastra } from '@mastra/core'
import { Hono } from 'hono'

import { NotFoundController } from '@/controllers/not-found-controller'
import { CrewDatabase } from '@/database/drizzle'
import { HealthMiddleware } from '@/middlewares/health-middleware'

const POSTGRES_IMAGE = 'pgvector/pgvector:pg17'

export type CrewResponse = { status: number; text: string }

export class CrewRestFixture {
  private isDatabaseRunning = true

  private constructor(
    private readonly container: StartedPostgreSqlContainer,
    private readonly crewDatabase: CrewDatabase,
    private readonly server: Hono,
  ) {}

  static async start(): Promise<CrewRestFixture> {
    const container = await new PostgreSqlContainer(POSTGRES_IMAGE)
      .withDatabase('crew')
      .withUsername('crew')
      .withPassword('crew')
      .start()
    const crewDatabase = new CrewDatabase(container.getConnectionUri())

    return CrewRestFixture.build(container, crewDatabase)
  }

  private static build(
    container: StartedPostgreSqlContainer,
    crewDatabase: CrewDatabase,
  ) {
    const mastra = new Mastra({
      logger: false,
      server: {
        apiRoutes: [new NotFoundController().route()],
      },
    })

    mastra.setServerMiddleware([new HealthMiddleware(crewDatabase).middleware()])

    const server = new Hono()

    for (const middleware of mastra.getServerMiddleware()) {
      server.use(middleware.path, middleware.handler)
    }

    server.all('/health', (c) => c.text('built-in health'))
    server.get('/api/auth/capabilities', (c) => c.json({ enabled: false }))

    for (const route of mastra.getServer()?.apiRoutes ?? []) {
      if ('_mastraSchemaRoute' in route || !('handler' in route)) continue

      server.on([route.method], [route.path], route.handler)
    }

    return new CrewRestFixture(container, crewDatabase, server)
  }

  async request(path: string, init: RequestInit = {}): Promise<CrewResponse> {
    const response = await this.server.request(path, init)

    return { status: response.status, text: await response.text() }
  }

  async stopDatabase() {
    if (!this.isDatabaseRunning) return

    this.isDatabaseRunning = false
    await this.container.stop()
  }

  async close() {
    await this.crewDatabase.close()
    await this.stopDatabase()
  }
}
