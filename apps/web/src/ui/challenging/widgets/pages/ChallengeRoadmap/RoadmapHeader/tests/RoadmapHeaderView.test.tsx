import { render, screen } from '@testing-library/react'
import { RoadmapHeaderView } from '../RoadmapHeaderView'

it('renders the roadmap heading and switch slot', () => {
  render(<RoadmapHeaderView switchSlot={<button type='button'>switch</button>} />)
  expect(screen.getByRole('heading', { name: 'Roadmap de desafios' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'switch' })).toBeInTheDocument()
})
