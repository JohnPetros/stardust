import { render, screen } from '@testing-library/react'
import { Kpi } from '@stardust/core/global/structures'

import { KpisView } from '../KpisView'

describe('KpisView', () => {
  const kpi = Kpi.create({ value: 10, currentMonthValue: 5, previousMonthValue: 4 })

  const View = () => {
    render(
      <KpisView
        createdUsersKpi={kpi}
        postedChallengesKpi={kpi}
        completedChallengesKpi={kpi}
        unlockedStarsKpi={kpi}
      />,
    )
  }

  it('should render the completed stars label instead of the unlocked stars one', () => {
    View()

    expect(screen.getByText('Estrelas concluídas')).toBeInTheDocument()
    expect(screen.queryByText('Estrelas desbloqueadas')).not.toBeInTheDocument()
  })

  it('should render the remaining KPI labels', () => {
    View()

    expect(screen.getByText('Usuários criados')).toBeInTheDocument()
    expect(screen.getByText('Desafios publicados')).toBeInTheDocument()
    expect(screen.getByText('Desafios completados')).toBeInTheDocument()
  })
})
