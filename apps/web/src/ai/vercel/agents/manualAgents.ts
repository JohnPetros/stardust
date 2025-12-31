import { stepCountIs, ToolLoopAgent } from 'ai'
import { openai } from '@ai-sdk/openai'

import { MANUAL_PROMPTS } from '@/ai/constants'
import { challengingToolset, manualToolset } from '../toolsets'

export const assistantAgent = new ToolLoopAgent({
  id: 'assistant-agent',
  instructions: MANUAL_PROMPTS.agents.assistant,
  model: openai('gpt-4'),
  stopWhen: stepCountIs(5),
  tools: {
    getMdxGuide: manualToolset.getMdxGuideTool,
    searchGuides: manualToolset.searchGuidesTool,
    getChallengeDescription: challengingToolset.getChallengeDescriptionTool,
  },
})
