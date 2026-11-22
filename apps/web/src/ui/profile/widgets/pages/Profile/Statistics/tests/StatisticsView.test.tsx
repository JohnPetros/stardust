import { render, screen } from '@testing-library/react'

import { StatisticsView } from '../StatisticsView'

jest.mock('../Statistic', () => ({
  Statistic: ({ title, value }: { title: string; value: number }) => (
    <div data-testid='statistic'>
      <span>{title}</span>
      <span data-testid={`value-${title}`}>{value}</span>
    </div>
  ),
}))

describe('StatisticsView', () => {
  const View = () => {
    render(
      <StatisticsView
        completedStarsCount={7}
        completedPlanetsCount={2}
        unlockedAchievementsCount={3}
      />,
    )
  }

  it('should label the stars statistic as completed stars with its value', () => {
    View()

    expect(screen.getByText('Estrelas concluídas')).toBeInTheDocument()
    expect(screen.getByTestId('value-Estrelas concluídas')).toHaveTextContent('7')
  })

  it('should not use the old completed stars label', () => {
    View()

    expect(screen.queryByText('Estrelas completadas')).not.toBeInTheDocument()
  })
})
