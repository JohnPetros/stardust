import type { RoadmapChallengeDto } from '../../types'
import { RoadmapDrawerFiltersView } from './RoadmapDrawerFiltersView'
import {
  useRoadmapDrawerFilters,
  type CompletionFilter,
  type DifficultyFilter,
} from './useRoadmapDrawerFilters'

type Props = {
  challenges: RoadmapChallengeDto[]
  onFiltersChange?: (challenges: RoadmapChallengeDto[]) => void
}
export function RoadmapDrawerFilters({ challenges, onFiltersChange }: Props) {
  const filters = useRoadmapDrawerFilters({ challenges, onChange: onFiltersChange })
  return (
    <RoadmapDrawerFiltersView
      query={filters.query}
      difficulty={filters.difficulty}
      completion={filters.completion}
      onQueryChange={filters.setQuery}
      onDifficultyChange={filters.setDifficulty as (value: DifficultyFilter) => void}
      onCompletionChange={filters.setCompletion as (value: CompletionFilter) => void}
    />
  )
}

export type { CompletionFilter, DifficultyFilter }
