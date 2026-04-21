import { stepCountIs, ToolLoopAgent } from 'ai'
import { openai } from '@ai-sdk/openai'

import { MANUAL_INSTRUCTIONS } from '@/ai/constants'
import { challengingToolset, manualToolset } from '../toolsets'

export const assistantAgent = new ToolLoopAgent({
  id: 'assistant-agent',
  instructions: MANUAL_INSTRUCTIONS.agents.assistant,
  model: openai('gpt-4o'),
  stopWhen: stepCountIs(3),
  tools: {
    searchGuides: manualToolset.searchGuidesTool,
    getChallengeDescription: challengingToolset.getChallengeDescriptionTool,
  },
})
