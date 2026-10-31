import { agentConfig } from '@mastra/core/agent'

import { REQUIREMENTS_MODELS } from '@/mastra/agents/pr-reviewer/constants/requirements-models'

export default agentConfig({
  description:
    'Revisa requisitos em pull requests: comportamento alterado sem testes, testes removidos ou enfraquecidos.',
  model: REQUIREMENTS_MODELS,
  workspace: undefined,
})
