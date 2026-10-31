import { AppError } from '@/errors/app-error'
import { registerApiRoute } from '@mastra/core/server'

import type { App } from '@/app'
import { AgentApiKeyMiddleware } from '@/middlewares/agent-api-key-middleware'
import { ErrorMiddleware } from '@/middlewares/error-middleware'
import { reviewInputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-input-schema'
import { reviewOutputSchema } from '@/mastra/agents/pr-reviewer/schemas/review-output-schema'
import { PR_REVIEWER_AGENT } from '@/mastra/agents/pr-reviewer/constants/pr-reviewer-agent'
import { buildPullRequestSubjectKey } from '@/utils/build-pull-request-subject-key'

export class PrReviewerCreateRunController {
  constructor(private readonly app: App) {}

  route() {
    return registerApiRoute('/pr-reviewer/v1/runs', {
      method: 'POST',
      middleware: [
        new ErrorMiddleware().handle,
        new AgentApiKeyMiddleware(PR_REVIEWER_AGENT).handle,
      ],
      handler: async (c) => {
        const idempotencyKey = c.req.header('Idempotency-Key')?.trim()

        if (!idempotencyKey) {
          throw new AppError(
            'O cabeçalho Idempotency-Key é obrigatório.',
            'Requisição inválida',
            { code: 'missing_idempotency_key' },
          )
        }

        const body: unknown = await c.req.json().catch(() => undefined)
        const parsedInput = reviewInputSchema.safeParse(body)

        if (!parsedInput.success) {
          const fields = [
            ...new Set(
              parsedInput.error.issues.map((issue) => issue.path.join('.') || 'body'),
            ),
          ]

          throw new AppError(
            `Entrada inválida: ${fields.join(', ')}.`,
            'Requisição inválida',
            { code: 'invalid_input' },
          )
        }

        const input = parsedInput.data
        const run = await this.app.createRun({
          agent: PR_REVIEWER_AGENT,
          workflowId: 'pr-review',
          idempotencyKey,
          input,
          subject: {
            key: buildPullRequestSubjectKey(input.repository, input.pull_number),
            revision: input.head_sha,
          },
          outputSchema: reviewOutputSchema,
        })

        return c.json({ run_id: run.id, status: run.status }, 202)
      },
    })
  }
}
