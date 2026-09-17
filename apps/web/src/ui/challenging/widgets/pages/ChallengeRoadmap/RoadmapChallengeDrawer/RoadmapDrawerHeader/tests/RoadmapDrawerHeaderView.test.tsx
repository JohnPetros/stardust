import { render, screen } from '@testing-library/react'
import { RoadmapDrawerHeaderView } from '../RoadmapDrawerHeaderView'
it('renders heading, progress and close label', () => {
  render(
    <RoadmapDrawerHeaderView
      title='Operadores'
      description='Descrição'
      completed={1}
      total={2}
      onClose={jest.fn()}
    />,
  )
  expect(screen.getByRole('heading', { name: 'Operadores' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Fechar drawer' })).toBeInTheDocument()
})
