// USD per million tokens. Haiku uses the higher prompt tier as a conservative estimate.
// https://platform.claude.com/docs/en/models/haiku-5-5/overview
// https://platform.claude.com/docs/en/models/sonnet-5-5/overview
export const MODEL_PRICES = {
  'claude-haiku-5-5': { input: 0.5, cachedInput: 0.05, output: 2.5 },
  'claude-sonnet-5-5': { input: 2, cachedInput: 0.1, output: 10 },
} as const
