import { render, screen } from '@testing-library/react'

import { OfficialSolutionCardView } from '../OfficialSolutionCardView'

describe('OfficialSolutionCardView', () => {
  it('identifies the official solution and links to its static route', () => {
    render(<OfficialSolutionCardView challengeSlug='example' />)

    expect(screen.getByTestId('official-solution-card')).toBeInTheDocument()
    expect(screen.getByText('Solução oficial da plataforma')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Abrir solução oficial do desafio' }),
    ).toHaveAttribute(
      'href',
      '/challenging/challenges/example/challenge/solutions/official',
    )
  })
})
