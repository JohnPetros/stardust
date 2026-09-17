import { render, screen } from '@testing-library/react'
import { RoadmapProgressSummaryView } from '../RoadmapProgressSummaryView'

const progress = { completed: 7, total: 20, percentage: 35 }

it('hides personal progress for visitors', () => {
  render(
    <RoadmapProgressSummaryView
      progress={progress}
      recommendation={null}
      isAuthenticated={false}
      onContinue={jest.fn()}
    />,
  )
  expect(screen.getByText(/Entre para acompanhar/)).toBeInTheDocument()
  expect(screen.queryByText(/7 de 20/)).not.toBeInTheDocument()
})

it('offers the recommendation CTA when available', () => {
  render(
    <RoadmapProgressSummaryView
      progress={progress}
      recommendation={{
        nodeKey: 'basico',
        challengeId: 'id',
        challengeSlug: 'enviando-mensagem',
      }}
      isAuthenticated
      onContinue={jest.fn()}
    />,
  )
  expect(
    screen.getByRole('button', { name: 'Continuar próximo desafio' }),
  ).toBeInTheDocument()
})
