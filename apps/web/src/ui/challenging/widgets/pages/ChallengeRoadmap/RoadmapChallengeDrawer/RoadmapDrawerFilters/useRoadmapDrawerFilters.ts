import { useEffect, useMemo, useState } from 'react'
import type { RoadmapChallengeDto } from '../../types'

export type CompletionFilter = 'all' | 'completed' | 'pending'
export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'
type Params = {
  challenges: RoadmapChallengeDto[]
  onChange?: (challenges: RoadmapChallengeDto[]) => void
}

export function useRoadmapDrawerFilters({ challenges, onChange }: Params) {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [completion, setCompletion] = useState<CompletionFilter>('all')
  const filteredChallenges = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    const result = challenges.filter((challenge) => {
      const matchesQuery =
        !normalized || challenge.title.toLocaleLowerCase().includes(normalized)
      const matchesDifficulty =
        difficulty === 'all' || challenge.difficultyLevel === difficulty
      const matchesCompletion =
        completion === 'all' ||
        (completion === 'completed'
          ? challenge.isCompleted === true
          : challenge.isCompleted !== true)
      return matchesQuery && matchesDifficulty && matchesCompletion
    })
    return result
  }, [challenges, completion, difficulty, query])
  useEffect(() => onChange?.(filteredChallenges), [filteredChallenges, onChange])
  return {
    query,
    difficulty,
    completion,
    filteredChallenges,
    setQuery,
    setDifficulty,
    setCompletion,
  }
}
