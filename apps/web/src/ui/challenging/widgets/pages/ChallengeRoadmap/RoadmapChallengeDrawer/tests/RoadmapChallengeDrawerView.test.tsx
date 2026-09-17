import { render, screen } from '@testing-library/react'
import { RoadmapChallengeDrawerView } from '../RoadmapChallengeDrawerView'

it('renders an accessible dialog with filters', () => {
  render(
    <RoadmapChallengeDrawerView
      node={{
        key: 'basico',
        category: { name: 'Básico' },
        position: { x: 0, y: 0 },
        recommendationOrder: 1,
        state: 'content',
        challengeIds: [],
        totalChallenges: 0,
        completedChallenges: 0,
        isCompleted: false,
        isEligible: true,
      }}
      challenges={[]}
      filteredChallenges={[]}
      isLoading={false}
      error={null}
      drawerRef={{ current: null }}
      onClose={jest.fn()}
      onRetry={jest.fn()}
      onFiltersChange={jest.fn()}
      onOpenChallenge={jest.fn()}
    />,
  )
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getByLabelText('Dificuldade')).toBeInTheDocument()
})
