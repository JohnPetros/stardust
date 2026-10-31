import type { ModelWithRetries } from '@mastra/core/agent'

export const REVIEWER_MODELS: ModelWithRetries[] = [
  { model: 'anthropic/claude-haiku-5-5', maxRetries: 1 },
  { model: 'anthropic/claude-sonnet-5-5', maxRetries: 0 },
]
