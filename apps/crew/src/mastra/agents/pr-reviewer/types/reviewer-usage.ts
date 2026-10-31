import type { ReviewerTrace } from '@/mastra/agents/pr-reviewer/types/reviewer-trace'

export type ReviewerUsage = {
  area: string
  modelId?: string
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  trace?: ReviewerTrace
}
