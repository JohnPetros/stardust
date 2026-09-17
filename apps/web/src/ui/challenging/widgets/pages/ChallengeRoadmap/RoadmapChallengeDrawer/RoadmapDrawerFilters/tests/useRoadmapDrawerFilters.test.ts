import { renderHook, act } from '@testing-library/react'
import { useRoadmapDrawerFilters } from '../useRoadmapDrawerFilters'

const challenges = [
  { title: 'Perímetro espacial', difficultyLevel: 'easy', isCompleted: true, order: 1 },
  {
    title: 'Resistências em circuitos',
    difficultyLevel: 'hard',
    isCompleted: false,
    order: 2,
  },
] as any
it('combines text, difficulty and completion filters', () => {
  const { result } = renderHook(() => useRoadmapDrawerFilters({ challenges }))
  act(() => result.current.setDifficulty('hard'))
  act(() => result.current.setCompletion('pending'))
  expect(result.current.filteredChallenges).toHaveLength(1)
  expect(result.current.filteredChallenges[0].title).toContain('Resistências')
})
