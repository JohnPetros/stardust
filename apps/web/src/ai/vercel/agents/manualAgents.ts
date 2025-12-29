import { stepCountIs, ToolLoopAgent } from 'ai'
import { openai } from '@ai-sdk/openai'

import { manualToolset } from '../toolsets'
import { MANUAL_PROMPTS } from '@/ai/constants'

export const assistantAgent = new ToolLoopAgent({
  id: 'assistant-agent',
  instructions: MANUAL_PROMPTS.agents.assistant,
  model: openai('gpt-4'),
  stopWhen: stepCountIs(3),
  tools: {
    getMdxGuide: manualToolset.getMdxGuideTool,
  },
  toolChoice: {
    type: 'tool',
    toolName: 'getMdxGuide',
  },
})
