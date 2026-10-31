import type { ReviewerUsage } from '@/mastra/agents/pr-reviewer/types/reviewer-usage'

export type UsageCollector = {
  usages: ReviewerUsage[]
  record(usage: ReviewerUsage): void
}
