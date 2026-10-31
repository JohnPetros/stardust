import { agentConfig } from '@mastra/core/agent'

import { REVIEWER_MODELS } from '@/mastra/agents/pr-reviewer/constants/reviewer-models'
import { REVIEWER_PROVIDER_OPTIONS } from '@/mastra/agents/pr-reviewer/constants/reviewer-provider-options'

export default agentConfig({
  description:
    'Revisa segurança em pull requests: autenticação, autorização, isolamento entre clientes, segredos e entrada não confiável.',
  model: REVIEWER_MODELS,
  defaultOptions: { providerOptions: REVIEWER_PROVIDER_OPTIONS },
  workspace: undefined,
})
