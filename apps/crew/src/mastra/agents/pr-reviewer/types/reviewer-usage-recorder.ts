import type { ReviewerUsage } from '@/mastra/agents/pr-reviewer/types/reviewer-usage'

export type ReviewerUsageRecorder = (usage: ReviewerUsage) => void
