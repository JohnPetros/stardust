import { Agent } from '@mastra/core/agent'

import { AGENTS_INSTRUCTIONS } from '@/ai/challenging/constants'
import { ChallengingToolkit } from '../toolkits'

export class ChallengingSquad {
  static get challengingCreatorAgent() {
    return new Agent({
      id: 'create-challenge-agent',
      name: 'Create Challenge Agent',
      instructions: AGENTS_INSTRUCTIONS.challengingCreator,
      model: 'openrouter/openai/gpt-5.4-mini',
      tools: {
        getAllChallengeCategoriesTool: ChallengingToolkit.getAllChallengeCategoriesTool,
      },
    })
  }
}
