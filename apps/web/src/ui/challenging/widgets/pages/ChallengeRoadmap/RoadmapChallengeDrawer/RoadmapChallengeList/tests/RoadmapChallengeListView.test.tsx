import { render, screen } from '@testing-library/react'
import { RoadmapChallengeListView } from '../RoadmapChallengeListView'
it('renders an accessible empty result', () => {
  render(<RoadmapChallengeListView challenges={[]} nodeKey='basico' onOpen={jest.fn()} />)
  expect(screen.getByRole('status')).toHaveTextContent('Nenhum desafio')
})
