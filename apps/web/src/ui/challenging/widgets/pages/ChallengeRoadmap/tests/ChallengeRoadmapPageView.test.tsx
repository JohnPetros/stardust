import { render, screen } from '@testing-library/react'
import { ChallengeRoadmapPageView } from '../ChallengeRoadmapPageView'

it('renders recoverable loading state', () => {
  render(
    <ChallengeRoadmapPageView
      roadmap={null}
      nodes={[]}
      graphNodes={[]}
      graphEdges={[]}
      selectedNode={null}
      selectedNodeKey={null}
      error={null}
      isLoading
      viewMode='map'
      setViewMode={jest.fn()}
      revalidate={jest.fn()}
      selectNode={jest.fn()}
      closeNode={jest.fn()}
      continueChallenge={jest.fn()}
      openChallenge={jest.fn()}
      viewportStorage={{ get: () => null, set: jest.fn() }}
      isAuthenticated={false}
      service={{} as never}
      analytics={{} as never}
    />,
  )
  expect(screen.getByRole('status')).toBeInTheDocument()
})
