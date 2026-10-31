import { AppError } from '@/errors/app-error'
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { Mastra } from '@mastra/core'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { Hono } from 'hono'

import { App } from '@/app'
import { CrewDatabase, resolveMigrationsFolder } from '@/database/drizzle'
import { AgentRunsModel } from '@/database/models/agent-runs-model'
import { DrizzleAgentRunsRepository } from '@/database/repositories/agent-runs-repository'
import { env } from '@/env'
import { PrReviewerCreateRunController } from '@/mastra/agents/pr-reviewer/controllers/pr-reviewer-create-run-controller'
import { PrReviewerGetRunController } from '@/mastra/agents/pr-reviewer/controllers/pr-reviewer-get-run-controller'
import { PrReviewerLastReviewController } from '@/mastra/agents/pr-reviewer/controllers/pr-reviewer-last-review-controller'
import { reviewInputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-input-schema'
import { reviewOutputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-output-schema'
import type { ReviewInput } from '@/mastra/agents/pr-reviewer/types/review-input'

const POSTGRES_IMAGE = 'pgvector/pgvector:pg17'
const RUN_POLL_INTERVAL_MS = 50
const RUN_POLL_TIMEOUT_MS = 10_000
const SHUTDOWN_GRACE_MS = 1_000

export type ApiResponse = { status: number; body: ApiBody }

export type ApiBody = {
  run_id: string
  status: string
  head_sha: string
  finished_at: string
  output: { scope: string; head_sha: string; review_status: string; findings: unknown[] }
  error: { code: string; message: string }
}

export class PrReviewerRestFixture {
  shouldFailReviews = false

  private constructor(
    private readonly container: StartedPostgreSqlContainer,
    private readonly crewDatabase: CrewDatabase,
    private readonly app: App,
    private readonly server: Hono,
  ) {}

  static async start(): Promise<PrReviewerRestFixture> {
    const container = await new PostgreSqlContainer(POSTGRES_IMAGE)
      .withDatabase('crew')
      .withUsername('crew')
      .withPassword('crew')
      .start()
    const crewDatabase = new CrewDatabase(container.getConnectionUri())

    try {
      await crewDatabase.migrate(resolveMigrationsFolder())

      return PrReviewerRestFixture.build(container, crewDatabase)
    } catch (error) {
      await crewDatabase.close()
      await container.stop()
      throw error
    }
  }

  private static build(
    container: StartedPostgreSqlContainer,
    crewDatabase: CrewDatabase,
  ) {
    let fixture: PrReviewerRestFixture | undefined
    let mastra: Mastra | undefined

    const app = new App({
      agentRunsRepository: new DrizzleAgentRunsRepository(crewDatabase.drizzle),
      logger: { info: () => {}, warn: () => {}, error: () => {} },
      runWorkflow: async (workflowId, inputData) => {
        const run = await mastra?.getWorkflowById(workflowId).createRun()
        const result = await run?.start({ inputData })

        if (result?.status === 'success') return result.result

        throw result?.status === 'failed'
          ? result.error
          : new AppError('The review workflow did not finish.', 'Workflow failed', {
              code: 'workflow_failed',
            })
      },
    })

    const reviewStep = createStep({
      id: 'review',
      inputSchema: reviewInputSchema,
      outputSchema: reviewOutputSchema,
      execute: async ({ inputData }) => {
        if (fixture?.shouldFailReviews) {
          throw new AppError('Every reviewer failed.', 'Reviewers failed', {
            code: 'reviewer_failed',
          })
        }

        return {
          scope: 'repository' as const,
          head_sha: inputData.head_sha,
          review_status: 'complete' as const,
          summary: 'Review complete.',
          findings: [],
        }
      },
    })

    mastra = new Mastra({
      logger: false,
      workflows: {
        'pr-review': createWorkflow({
          id: 'pr-review',
          inputSchema: reviewInputSchema,
          outputSchema: reviewOutputSchema,
          options: { shouldPersistSnapshot: () => false },
        })
          .then(reviewStep)
          .commit(),
      },
      server: {
        apiRoutes: [
          new PrReviewerCreateRunController(app).route(),
          new PrReviewerGetRunController(app).route(),
          new PrReviewerLastReviewController(app).route(),
        ],
      },
    })

    const server = new Hono()

    for (const route of mastra.getServer()?.apiRoutes ?? []) {
      if (
        '_mastraSchemaRoute' in route ||
        !('handler' in route) ||
        route.method === 'ALL'
      )
        continue

      const middleware = [route.middleware ?? []].flat()

      server.on([route.method], [route.path], ...middleware, route.handler)
    }

    fixture = new PrReviewerRestFixture(container, crewDatabase, app, server)

    return fixture
  }

  static buildInput(overrides: Partial<ReviewInput> = {}): ReviewInput {
    return {
      repository: 'JohnPetros/stardust',
      pull_number: 7,
      base_sha: 'b'.repeat(40),
      head_sha: 'a'.repeat(40),
      range_base_sha: 'b'.repeat(40),
      review_mode: 'full',
      agents_md: '# AGENTS',
      review_md: '# Review criterion',
      changed_files: ['src/a.ts'],
      changed_lines: [{ path: 'src/a.ts', line: 3 }],
      diff: '@@ -1 +1 @@\n-a\n+b',
      regression_facts: { deleted_files: [], changed_migrations: [] },
      ...overrides,
    }
  }

  async reset() {
    this.shouldFailReviews = false
    await this.crewDatabase.drizzle.delete(AgentRunsModel)
  }

  async close() {
    await this.app.shutdown({ graceMs: SHUTDOWN_GRACE_MS })
    await this.crewDatabase.close()
    await this.container.stop()
  }

  async request(
    path: string,
    init: RequestInit = {},
    { authorized = true } = {},
  ): Promise<ApiResponse> {
    const headers = new Headers(init.headers)

    if (authorized) headers.set('Authorization', `Bearer ${env.PR_REVIEWER_API_KEY}`)

    const response = await this.server.request(path, { ...init, headers })

    return { status: response.status, body: (await response.json()) as ApiBody }
  }

  createRun(input: ReviewInput, idempotencyKey: string) {
    return this.request('/pr-reviewer/v1/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(input),
    })
  }

  async waitForRun(runId: string): Promise<ApiBody> {
    const deadline = Date.now() + RUN_POLL_TIMEOUT_MS

    while (Date.now() < deadline) {
      const { body } = await this.request(`/pr-reviewer/v1/runs/${runId}`)

      if (body.status === 'completed' || body.status === 'failed') return body

      await new Promise((resolve) => setTimeout(resolve, RUN_POLL_INTERVAL_MS))
    }

    throw new Error(`Run ${runId} did not finish within ${RUN_POLL_TIMEOUT_MS} ms.`)
  }
}
