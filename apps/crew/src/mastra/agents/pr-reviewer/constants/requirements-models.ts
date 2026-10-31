import type { ModelWithRetries } from '@mastra/core/agent'

export const REQUIREMENTS_MODELS: ModelWithRetries[] = [
  {
    model: 'anthropic/claude-haiku-5-5',
    maxRetries: 1,
    providerOptions: { anthropic: { thinking: { type: 'adaptive' }, effort: 'medium' } },
  },
  {
    model: 'anthropic/claude-sonnet-5-5',
    maxRetries: 0,
    providerOptions: { anthropic: { thinking: { type: 'adaptive' }, effort: 'medium' } },
  },
]
