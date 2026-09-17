import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import { RoadmapCategoryNodeView } from '../RoadmapCategoryNodeView'

const node = {
  key: 'basico',
  category: { name: 'Básico' },
  position: { x: 0, y: 0 },
  recommendationOrder: 1,
  state: 'content' as const,
  challengeIds: ['1', '2'],
  totalChallenges: 2,
  completedChallenges: 1,
  isCompleted: false,
  isEligible: true,
}

it('announces progress and supports keyboard semantics', () => {
  render(
    <ReactFlowProvider>
      <RoadmapCategoryNodeView
        node={node}
        isSelected={false}
        isRecommended
        onSelect={jest.fn()}
      />
    </ReactFlowProvider>,
  )
  expect(
    screen.getByRole('button', { name: /Básico, 1 de 2 concluídos/ }),
  ).toBeInTheDocument()
})

it('opens coming soon nodes without offering a challenge action', () => {
  render(
    <ReactFlowProvider>
      <RoadmapCategoryNodeView
        node={{
          ...node,
          state: 'comingSoon',
          totalChallenges: 0,
          completedChallenges: null,
        }}
        isSelected={false}
        isRecommended={false}
        onSelect={jest.fn()}
      />
    </ReactFlowProvider>,
  )
  expect(screen.getByText(/Em breve/)).toBeInTheDocument()
  expect(screen.getByRole('button')).toBeEnabled()
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})
