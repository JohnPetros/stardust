import { render, screen } from '@testing-library/react'

import { ChallengesViewSwitchView } from '../ChallengesViewSwitchView'

describe('ChallengesViewSwitchView', () => {
  it('renders both accessible navigation links and active state', () => {
    render(
      <ChallengesViewSwitchView
        activeView='roadmap'
        roadmapHref='/challenging/roadmap'
        catalogHref='/challenging/challenges'
      />,
    )

    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Todos os desafios' })).toHaveAttribute(
      'href',
      '/challenging/challenges',
    )
  })
})
