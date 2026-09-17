import { render, screen } from '@testing-library/react'
import { RoadmapGraphView } from '../RoadmapGraphView'

jest.mock('@xyflow/react', () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='flow'>{children}</div>
  ),
  Background: () => <div />,
  Controls: () => <div />,
}))

it('renders a labelled read-only graph surface', () => {
  render(<RoadmapGraphView nodes={[]} edges={[]} onMoveEnd={jest.fn()} />)
  expect(
    screen.getByRole('region', { name: 'Mapa visual do roadmap' }),
  ).toBeInTheDocument()
})
