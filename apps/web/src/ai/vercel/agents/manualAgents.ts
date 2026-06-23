import { stepCountIs, ToolLoopAgent } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

import { MANUAL_INSTRUCTIONS } from '@/ai/constants'
import { SERVER_ENV } from '@/constants/server-env'
import { challengingToolset, manualToolset } from '../toolsets'

const openrouter = createOpenRouter({
  apiKey: SERVER_ENV.openrouterApiKey,
})

export const assistantAgent = new ToolLoopAgent({
  id: 'assistant-agent',
  instructions: MANUAL_INSTRUCTIONS.agents.assistant,
  model: openrouter('openai/gpt-5.4-mini'),
  stopWhen: stepCountIs(3),
  tools: {
    getLspGuides: manualToolset.getLspGuidesTool,
    getChallengeDescription: challengingToolset.getChallengeDescriptionTool,
  },
})
