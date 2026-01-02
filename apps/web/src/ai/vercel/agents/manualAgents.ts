import { stepCountIs, ToolLoopAgent } from 'ai'
import { google } from '@ai-sdk/google'

import { MANUAL_PROMPTS } from '@/ai/constants'
import { challengingToolset, manualToolset } from '../toolsets'

export const assistantAgent = new ToolLoopAgent({
  id: 'assistant-agent',
  instructions: MANUAL_PROMPTS.agents.assistant,
  model: google('gemini-3-flash-preview'),
  stopWhen: stepCountIs(3),
  tools: {
    getMdxGuide: manualToolset.getMdxGuideTool,
    searchGuides: manualToolset.searchGuidesTool,
    getChallengeDescription: challengingToolset.getChallengeDescriptionTool,
  },
})
