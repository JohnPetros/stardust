import { Agent } from '@mastra/core/agent'
import { openai } from '@ai-sdk/openai'

import { AGENTS_INSTRUCTIONS } from '@/ai/challenging/constants'
import { ChallengingToolset } from '../toolsets'

export class ChallengingSquad {
  static get challengingCreatorAgent() {
    return new Agent({
      id: 'create-challenge-agent',
      name: 'Create Challenge Agent',
      instructions: AGENTS_INSTRUCTIONS.challengingCreator,
      model: openai('gpt-4o'),
      tools: {
        getAllChallengeCategoriesTool: ChallengingToolset.getAllChallengeCategoriesTool,
      },
    })
  }
}
