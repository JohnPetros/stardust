import { render, screen } from '@testing-library/react'
import { RoadmapChallengeItemView } from '../RoadmapChallengeItemView'
it('shows completion/recommendation and contextual link', () => {
  render(
    <RoadmapChallengeItemView
      challenge={{
        id: '1',
        slug: 'desafio',
        title: 'Meu desafio',
        initialCode: '',
        difficultyLevel: 'easy',
        description: '',
        testCases: [],
        author: {} as never,
        categories: [],
        order: 1,
        isCompleted: false,
      }}
      nodeKey='basico'
      isRecommended
      onOpen={jest.fn()}
    />,
  )
  expect(screen.getByText(/Recomendado/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Meu desafio' })).toHaveAttribute(
    'href',
    '/challenging/challenges/desafio/challenge?from=roadmap&node=basico',
  )
})
