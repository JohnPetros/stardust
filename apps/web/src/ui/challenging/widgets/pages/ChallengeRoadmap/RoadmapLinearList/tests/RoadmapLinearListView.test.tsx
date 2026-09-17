import { render, screen } from '@testing-library/react'
import { RoadmapLinearListView } from '../RoadmapLinearListView'

it('renders all nodes in editorial order', () => {
  render(
    <RoadmapLinearListView
      nodes={[
        {
          key: 'a',
          category: { name: 'A' },
          position: { x: 0, y: 0 },
          recommendationOrder: 1,
          state: 'content',
          challengeIds: [],
          totalChallenges: 0,
          completedChallenges: 0,
          isCompleted: false,
          isEligible: true,
          prerequisiteKeys: [],
        },
      ]}
      selectedNodeKey={null}
      recommendationNodeKey={null}
      onSelect={jest.fn()}
    />,
  )
  expect(
    screen.getByRole('list', { name: 'Roadmap em ordem de aprendizado' }),
  ).toBeInTheDocument()
})
