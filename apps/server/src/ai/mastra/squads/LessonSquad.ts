import { AGENTS_INSTRUCTIONS } from '@/ai/lesson/constants'
import { openai } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'
import { LessonToolset } from '../toolsets'

export class LessonSquad {
  static get codeExplainerAgent() {
    return new Agent({
      id: 'explain-code-agent',
      name: 'Explain Code Agent',
      instructions: AGENTS_INSTRUCTIONS.codeExplainerAgent,
      model: openai('gpt-4o'),
      tools: {
        getMdxBlocksGuideTool: LessonToolset.getMdxBlocksGuideTool,
      },
    })
  }
}
