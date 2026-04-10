import { createStep, createWorkflow } from '@mastra/core/workflows'
import z from 'zod'

import type { ExplainCodeWorkflow } from '@stardust/core/lesson/interfaces'
import { codeExplanationResponseSchema } from '@stardust/validation/lesson/schemas'

import { LessonTeam } from '../teams'

export class MastraExplainCodeWorkflow implements ExplainCodeWorkflow {
  async run(code: string): Promise<string> {
    const explainCodeStep = this.explainCode()

    const workflow = createWorkflow({
      id: 'explain-code-workflow',
      inputSchema: z.object({ code: z.string() }),
      outputSchema: z.object({ explanation: z.string() }),
    })
      .map(async ({ inputData }) => ({
        prompt: `Explique o seguinte codigo:\n\n${inputData.code}`,
      }))
      .then(explainCodeStep)
      .map(async ({ inputData }) => ({
        explanation: inputData.explanation,
      }))
      .commit()

    const run = await workflow.createRun()

    try {
      const result = await run.start({
        inputData: { code },
      })

      if (result.status !== 'success') {
        throw new Error('Code explanation workflow did not complete successfully')
      }

      return result.result.explanation
    } catch (error) {
      run.cancel()
      throw error
    }
  }

  private explainCode() {
    return createStep(LessonTeam.codeExplainerAgent, {
      structuredOutput: {
        schema: codeExplanationResponseSchema,
      },
    })
  }
}
