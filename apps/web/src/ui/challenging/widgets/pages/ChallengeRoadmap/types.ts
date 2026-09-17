import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import type {
  ChallengeRoadmapDto,
  RoadmapNodeDto,
  RoadmapNodeChallengesDto,
} from '@stardust/core/challenging/structures/dtos'

export type RoadmapChallenge = RoadmapNodeChallengesDto['challenges'][number]
export type RoadmapViewMode = 'map' | 'list'
export type RoadmapState = 'content' | 'loading' | 'error' | 'empty'

export type RoadmapNavigation = {
  goTo: (route: string) => void
}

export type RoadmapProps = {
  initialRoadmap?: ChallengeRoadmapDto
  initialError?: string
}

export type NodeSelectionHandler = (nodeKey: string) => void

export type RoadmapNodeWithMeta = RoadmapNodeDto & {
  prerequisiteKeys: string[]
}

export type RoadmapChallengeDto = ChallengeDto & {
  order: number
  isCompleted: boolean | null
}
