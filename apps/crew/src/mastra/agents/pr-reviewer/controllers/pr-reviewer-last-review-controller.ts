import { AppError } from '@/errors/app-error'
import { registerApiRoute } from '@mastra/core/server'
import { z } from 'zod'

import type { App } from '@/app'
import { AgentApiKeyMiddleware } from '@/middlewares/agent-api-key-middleware'
import { ErrorMiddleware } from '@/middlewares/error-middleware'
import { PR_REVIEWER_AGENT } from '@/mastra/agents/pr-reviewer/constants/pr-reviewer-agent'
import { buildPullRequestSubjectKey } from '@/utils/build-pull-request-subject-key'

const lastReviewQuerySchema = z.object({
  repository: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  pull_number: z.coerce.number().int().positive(),
})

export class PrReviewerLastReviewController {
  constructor(private readonly app: App) {}

  route() {
    return registerApiRoute('/pr-reviewer/v1/last-review', {
      method: 'GET',
      middleware: [
        new ErrorMiddleware().handle,
        new AgentApiKeyMiddleware(PR_REVIEWER_AGENT).handle,
      ],
      handler: async (c) => {
        const parsedQuery = lastReviewQuerySchema.safeParse(c.req.query())

        if (!parsedQuery.success) {
          const fields = [
            ...new Set(parsedQuery.error.issues.map((issue) => issue.path.join('.'))),
          ]

          throw new AppError(
            `Consulta inválida: ${fields.join(', ')}.`,
            'Requisição inválida',
            { code: 'invalid_input' },
          )
        }

        const { repository, pull_number: pullNumber } = parsedQuery.data
        const run = await this.app.getLastReview({
          agent: PR_REVIEWER_AGENT,
          subjectKey: buildPullRequestSubjectKey(repository, pullNumber),
        })

        return c.json({
          head_sha: run.subjectRevision,
          finished_at: run.finishedAt?.toISOString(),
          run_id: run.id,
        })
      },
    })
  }
}
