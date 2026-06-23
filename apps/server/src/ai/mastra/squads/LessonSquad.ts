import { AGENTS_INSTRUCTIONS } from '@/ai/lesson/constants'
import { Agent } from '@mastra/core/agent'

export class LessonSquad {
  static get codeExplainerAgent() {
    return new Agent({
      id: 'explain-code-agent',
      name: 'Explain Code Agent',
      instructions: AGENTS_INSTRUCTIONS.codeExplainerAgent,
      model: 'openrouter/openai/gpt-5.4-mini',
    })
  }
}
