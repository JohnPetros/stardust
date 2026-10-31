import { AppError } from '@/errors/app-error'
import { Mastra } from '@mastra/core'
import { ConsoleLogger } from '@mastra/core/logger'

import { App } from '@/app'
import { NotFoundController } from '@/controllers/not-found-controller'
import { CrewDatabase, resolveMigrationsFolder } from '@/database/drizzle'
import { DrizzleAgentRunsRepository } from '@/database/repositories/agent-runs-repository'
import { env } from '@/env'
import { PrReviewerCreateRunController } from '@/mastra/agents/pr-reviewer/controllers/pr-reviewer-create-run-controller'
import { PrReviewerGetRunController } from '@/mastra/agents/pr-reviewer/controllers/pr-reviewer-get-run-controller'
import { PrReviewerLastReviewController } from '@/mastra/agents/pr-reviewer/controllers/pr-reviewer-last-review-controller'
import { mastraStore } from '@/mastra/mastra-store'
import { PrReviewWorkflow } from '@/mastra/workflows/pr-review-workflow'
import { PurgeOldRunsWorkflow } from '@/mastra/workflows/purge-old-runs-workflow'
import { HealthMiddleware } from '@/middlewares/health-middleware'
import { ErrorHandler } from '@/middlewares/error-middleware'
import { DenyBuiltInRoutesMiddleware } from '@/middlewares/deny-built-in-routes-middleware'
import { describeError } from '@/utils/describe-error'
import { getErrorCode } from '@/utils/get-error-code'

const SHUTDOWN_GRACE_MS = 300_000

const logger = new ConsoleLogger({ name: 'crew', level: 'info' })
const crewDatabase = new CrewDatabase(env.CREW_DATABASE_URL)
const agentRunsRepository = new DrizzleAgentRunsRepository(crewDatabase.drizzle)

const app = new App({
  agentRunsRepository,
  logger,
  runWorkflow: async (workflowId, inputData, { abortSignal }) => {
    const registry: Mastra = mastra
    const run = await registry.getWorkflowById(workflowId).createRun()

    function cancel() {
      void run.cancel()
    }

    abortSignal.addEventListener('abort', cancel, { once: true })

    try {
      const result = await run.start({ inputData })

      if (result.status === 'success') return result.result

      throw result.status === 'failed'
        ? result.error
        : new AppError(
            'O fluxo de revisão não terminou com sucesso.',
            'Fluxo não concluído',
            {
              code: 'workflow_failed',
              status: result.status,
            },
          )
    } finally {
      abortSignal.removeEventListener('abort', cancel)
    }
  },
})

try {
  await crewDatabase.migrate(resolveMigrationsFolder())
  logger.info('crew: migrations applied')
} catch (error) {
  logger.error(`crew: migrations failed (code ${getErrorCode(error) ?? 'unknown'})`)
  process.exit(1)
}

await app.recoverInterruptedRuns()
app.startMaintenance()

export const mastra = new Mastra({
  logger,
  storage: mastraStore,
  workflows: {
    'pr-review': new PrReviewWorkflow().create(),
    'purge-old-runs': new PurgeOldRunsWorkflow(app).create(),
  },
  server: {
    port: env.CREW_PORT,
    host: env.CREW_HOST,
    handleShutdownSignals: false,
    onError: env.CREW_ENV === 'prod' ? new ErrorHandler().handle : undefined,
    middleware: [
      new DenyBuiltInRoutesMiddleware({ enabled: env.CREW_ENV === 'prod' }).handle,
    ],
    apiRoutes: [
      new PrReviewerCreateRunController(app).route(),
      new PrReviewerGetRunController(app).route(),
      new PrReviewerLastReviewController(app).route(),
      ...(env.CREW_ENV === 'prod' ? [new NotFoundController().route()] : []),
    ],
  },
})

mastra.setServerMiddleware([new HealthMiddleware(crewDatabase).middleware()])

async function runShutdownStep(step: string, action: () => Promise<unknown>) {
  try {
    await action()
  } catch (error) {
    logger.error(`crew: shutdown step ${step} failed: ${describeError(error)}`)
  }
}

let isShutdownStarted = false

async function handleShutdownSignal() {
  if (isShutdownStarted) return
  isShutdownStarted = true

  await runShutdownStep('app', () => app.shutdown({ graceMs: SHUTDOWN_GRACE_MS }))
  await runShutdownStep('mastra', () => mastra.shutdown())
  await runShutdownStep('database', () => crewDatabase.close())
  process.exit(0)
}

process.on('SIGTERM', () => void handleShutdownSignal())
process.on('SIGINT', () => void handleShutdownSignal())
