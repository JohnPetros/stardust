import { render, screen } from '@testing-library/react'
import { RoadmapDrawerFiltersView } from '../RoadmapDrawerFiltersView'
it('labels search and both filters', () => {
  render(
    <RoadmapDrawerFiltersView
      query=''
      difficulty='all'
      completion='all'
      onQueryChange={jest.fn()}
      onDifficultyChange={jest.fn()}
      onCompletionChange={jest.fn()}
    />,
  )
  expect(screen.getByLabelText('Buscar desafio')).toBeInTheDocument()
  expect(screen.getByLabelText('Dificuldade')).toBeInTheDocument()
  expect(screen.getByLabelText('Conclusão')).toBeInTheDocument()
})
