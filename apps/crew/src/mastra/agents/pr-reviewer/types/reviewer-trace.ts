import type { ReviewerFailure } from '@/mastra/agents/pr-reviewer/types/reviewer-failure'
import type { ReviewerToolCall } from '@/mastra/agents/pr-reviewer/types/reviewer-tool-call'

export type ReviewerTrace = {
  status: 'complete' | 'blocked' | 'invalid' | 'error'
  blockedReason?: string
  stepsCount: number
  elapsedMs: number
  failure?: ReviewerFailure
  answer?: string
  structuringStatus?: string
  parseFailures?: string[]
  finishReason?: string
  toolCalls: ReviewerToolCall[]
}
