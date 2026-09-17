import { render, screen } from '@testing-library/react'
import { RoadmapLinearItemView } from '../RoadmapLinearItemView'

it('announces prerequisites and progress', () => {
  render(
    <RoadmapLinearItemView
      node={{
        key: 'lacos',
        category: { name: 'Laços' },
        position: { x: 0, y: 0 },
        recommendationOrder: 8,
        state: 'content',
        challengeIds: ['1'],
        totalChallenges: 1,
        completedChallenges: 0,
        isCompleted: false,
        isEligible: false,
        prerequisiteKeys: ['Lógicos'],
      }}
      isSelected={false}
      isRecommended={false}
      onSelect={jest.fn()}
    />,
  )
  expect(
    screen.getByRole('button', { name: /Pré-requisitos: Lógicos/ }),
  ).toBeInTheDocument()
})

it('announces a recommendation independently from editorial order', () => {
  render(
    <RoadmapLinearItemView
      node={{
        key: 'condicionais',
        category: { name: 'Condicionais' },
        position: { x: 0, y: 0 },
        recommendationOrder: 8,
        state: 'content',
        challengeIds: ['1'],
        totalChallenges: 1,
        completedChallenges: 0,
        isCompleted: false,
        isEligible: true,
        prerequisiteKeys: [],
      }}
      isSelected={false}
      isRecommended
      onSelect={jest.fn()}
    />,
  )
  expect(screen.getByText('Recomendado')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Recomendado para continuar/ })).toBeInTheDocument()
})
