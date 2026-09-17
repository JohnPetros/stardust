import { render, screen } from '@testing-library/react'
import { RoadmapStateMessageView } from '../RoadmapStateMessageView'

it('renders an accessible retry error', () => {
  render(<RoadmapStateMessageView variant='error' onAction={jest.fn()} />)
  expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite')
  expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
})
