import { AGENTS_INSTRUCTIONS } from '@/ai/lesson/constants'
import { openai } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'
import { LessonToolkit } from '../toolkits'

export class LessonSquad {
  static get codeExplainerAgent() {
    return new Agent({
      id: 'explain-code-agent',
      name: 'Explain Code Agent',
      instructions: AGENTS_INSTRUCTIONS.codeExplainerAgent,
      model: openai('gpt-5.4-mini'),
      tools: {
        getMdxBlocksGuideTool: LessonToolkit.getMdxBlocksGuideTool,
      },
    })
  }
}
