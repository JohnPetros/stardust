import { openai } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'

import { EXPLAIN_CODE_INSTRUCTION } from '@/ai/constants/agents-instructions'

export class LessonTeam {
  static get codeExplainerAgent() {
    return new Agent({
      id: 'explain-code-agent',
      name: 'Explain Code Agent',
      instructions: EXPLAIN_CODE_INSTRUCTION,
      model: openai('gpt-5.1'),
    })
  }
}
