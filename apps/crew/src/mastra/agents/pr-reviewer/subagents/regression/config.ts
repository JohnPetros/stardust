import { agentConfig } from '@mastra/core/agent'

import { REVIEWER_MODELS } from '@/mastra/agents/pr-reviewer/constants/reviewer-models'
import { REVIEWER_PROVIDER_OPTIONS } from '@/mastra/agents/pr-reviewer/constants/reviewer-provider-options'

export default agentConfig({
  description:
    'Revisa regressões em pull requests: arquivos fora do escopo, remoções, mudanças de schema e migrations, APIs inventadas.',
  model: REVIEWER_MODELS,
  defaultOptions: { providerOptions: REVIEWER_PROVIDER_OPTIONS },
  workspace: undefined,
})
