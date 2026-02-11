import { Agent } from '@mastra/core/agent'
import { openai } from '@ai-sdk/openai'

import { AGENTS_INSTRUCTIONS } from '@/ai/constants'
import { ChallengingToolset } from '../toolsets'

export class ChallengingTeam {
  static get challengingCreatorAgent() {
    return new Agent({
      id: 'create-challenge-agent',
      name: 'Create Challenge Agent',
      instructions: AGENTS_INSTRUCTIONS.challengingCreator,
      model: openai('gpt-5.1'),
      tools: {
        getAllChallengeCategoriesTool: ChallengingToolset.getAllChallengeCategoriesTool,
      },
    })
  }
}
