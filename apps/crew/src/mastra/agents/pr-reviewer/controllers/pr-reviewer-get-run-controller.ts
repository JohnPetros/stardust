import { AppError } from '@/errors/app-error'
import { registerApiRoute } from '@mastra/core/server'

import type { App } from '@/app'
import { AgentApiKeyMiddleware } from '@/middlewares/agent-api-key-middleware'
import { ErrorMiddleware } from '@/middlewares/error-middleware'
import { PR_REVIEWER_AGENT } from '@/mastra/agents/pr-reviewer/constants/pr-reviewer-agent'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class PrReviewerGetRunController {
  constructor(private readonly app: App) {}

  route() {
    return registerApiRoute('/pr-reviewer/v1/runs/:runId', {
      method: 'GET',
      middleware: [
        new ErrorMiddleware().handle,
        new AgentApiKeyMiddleware(PR_REVIEWER_AGENT).handle,
      ],
      handler: async (c) => {
        const runId = c.req.param('runId')

        if (!UUID_PATTERN.test(runId)) {
          throw new AppError('Execução não encontrada.', 'Execução não encontrada', {
            code: 'run_not_found',
          })
        }

        const run = await this.app.getRun(PR_REVIEWER_AGENT, runId)

        return c.json({
          run_id: run.id,
          status: run.status,
          ...(run.status === 'completed' && { output: run.output }),
          ...(run.status === 'failed' && {
            error: { code: run.errorCode, message: run.errorMessage },
          }),
        })
      },
    })
  }
}
