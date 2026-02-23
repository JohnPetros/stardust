import { createStep, createWorkflow } from '@mastra/core/workflows'
import z from 'zod'

import { challengeDraftSchema } from '@stardust/validation/challenging/schemas'
import type { CreateChallengeWorkflow } from '@stardust/core/challenging/interfaces'

import { ChallengingToolset } from '../toolsets/ChallengingToolset'
import { ChallengingTeam } from '../teams/ChallengingTeam'

export class MastraCreateChallengeWorkflow implements CreateChallengeWorkflow {
  async run() {
    const workflow = createWorkflow({
      id: 'create-challenge-workflow',
      inputSchema: z.void(),
      outputSchema: z.void(),
    })
      .then(this.getChallengeProblem())
      .map(async ({ inputData }) => ({ prompt: inputData.problem }))
      .then(this.createChallenge())
      .then(this.postChallenge())
      .commit()

    const run = await workflow.createRun()
    try {
      await run.start({ inputData: undefined })
    } catch (error) {
      run.cancel()
      throw error
    }
  }

  private getChallengeProblem() {
    return createStep(ChallengingToolset.getChallengeProblemTool)
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
