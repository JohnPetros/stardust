import { agentConfig } from '@mastra/core/agent'

import { REVIEWER_MODELS } from '@/mastra/agents/pr-reviewer/constants/reviewer-models'

export default agentConfig({
  description:
    'Revisa pull requests do StarDust com cinco revisores especializados executados em paralelo.',
  model: REVIEWER_MODELS,
  workspace: undefined,
})
