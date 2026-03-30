import { createStep, createWorkflow } from '@mastra/core/workflows'
import z from 'zod'

import { challengeDraftSchema } from '@stardust/validation/challenging/schemas'
import type { CreateChallengeWorkflow } from '@stardust/core/challenging/interfaces'

import { ChallengingToolset } from '../toolsets/ChallengingToolset'
import { ChallengingTeam } from '../teams/ChallengingTeam'

export class MastraCreateChallengeWorkflow implements CreateChallengeWorkflow {
  async run() {
    const getNextChallengeSourceStep = this.getNextChallengeSource()
    const createChallengeStep = this.createChallenge()
    const postChallengeStep = this.postChallenge()

    const workflow = createWorkflow({
      id: 'create-challenge-workflow',
      inputSchema: z.void(),
      outputSchema: z.void(),
    })
      .then(getNextChallengeSourceStep)
      .map(async ({ inputData }) => ({
        prompt: `URL da fonte: ${inputData.url}. Instruções adicionais: ${inputData.additionalInstructions ?? 'nenhuma'}.`,
      }))
      .then(createChallengeStep)
      .map(async ({ inputData, getStepResult }) => {
        const challengeSource = getStepResult(getNextChallengeSourceStep)
        return {
          ...inputData,
          challengeSourceId: challengeSource.id,
        }
      })
      .then(postChallengeStep)
      .commit()

    const run = await workflow.createRun()
    try {
      await run.start({ inputData: undefined })
    } catch (error) {
      run.cancel()
      throw error
    }
  }

  private getNextChallengeSource() {
    return createStep(ChallengingToolset.getNextChallengeSourceTool)
  }

  private createChallenge() {
    return createStep(ChallengingTeam.challengingCreatorAgent, {
      structuredOutput: { schema: challengeDraftSchema },
    })
  }

  private postChallenge() {
    return createStep(ChallengingToolset.postChallengingTool)
  }
}
