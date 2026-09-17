import type { ChallengeCategoryDto, ChallengeDto } from '../../entities/dtos'

export type RoadmapNodeDto = {
  key: string
  category: ChallengeCategoryDto
  position: { x: number; y: number }
  recommendationOrder: number
  state: 'content' | 'comingSoon'
  challengeIds: string[]
  totalChallenges: number
  completedChallenges: number | null
  isCompleted: boolean | null
  isEligible: boolean | null
  /** Internal mapper metadata; it is never returned by the public snapshot. */
  challengeSlugs?: string[]
}

export type ChallengeRoadmapDto = {
  revision: { key: string; version: number; publishedAt: string }
  nodes: RoadmapNodeDto[]
  edges: Array<{
    prerequisiteNodeKey: string
    dependentNodeKey: string
  }>
  progress: { completed: number; total: number; percentage: number } | null
  recommendation: {
    nodeKey: string
    challengeId: string
    challengeSlug: string
  } | null
}

export type RoadmapNodeChallengesDto = {
  nodeKey: string
  challenges: Array<
    ChallengeDto & {
      order: number
      isCompleted: boolean | null
    }
  >
}
