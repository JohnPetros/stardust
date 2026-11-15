import { render, screen } from '@testing-library/react'

import { PlanetsFaker } from '@stardust/core/space/entities/fakers'

import { ROUTES } from '@/constants'
import { type Props, SpacePageView } from '../SpacePageView'

jest.mock('../Particles', () => ({
  Particles: () => <div data-testid='particles' />,
}))

jest.mock('../Planet', () => ({
  Planet: ({ name }: { name: string }) => <div data-testid='planet'>{name}</div>,
}))

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: () => <div data-testid='animation' />,
}))

jest.mock('@/ui/global/widgets/components/Fab', () => ({
  Fab: ({ label }: { label: string }) => <button type='button'>{label}</button>,
}))

describe('SpacePageView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <SpacePageView
        planets={PlanetsFaker.fakeMany(2)}
        lastUnlockedStarId='star-id'
        lastUnlockedStarPosition='in'
        galaxyName='Lógica de Programação'
        hasGalaxyChoice={true}
        shouldShowEnding={false}
        onFabClick={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render the galaxy control with a link to the galaxies page when there is a galaxy choice', () => {
    View()

    const control = screen.getByRole('link', {
      name: 'Lógica de Programação: ver galáxias',
    })

    expect(control).toHaveAttribute('href', ROUTES.galaxies)
  })

  it('should not render the galaxy control when there is no galaxy choice', () => {
    View({ hasGalaxyChoice: false })

    expect(screen.queryByRole('link', { name: /ver galáxias/i })).not.toBeInTheDocument()
  })

  it('should render the planets of the galaxy', () => {
    View()

    expect(screen.getAllByTestId('planet')).toHaveLength(2)
  })

  it('should render the thanks link when the ending should be shown', () => {
    View({ shouldShowEnding: true })

    expect(screen.getByRole('link', { name: /agradecimentos/i })).toHaveAttribute(
      'href',
      ROUTES.lesson.ending,
    )
  })

  it('should not render the thanks link when the ending should not be shown', () => {
    View({ shouldShowEnding: false })

    expect(
      screen.queryByRole('link', { name: /agradecimentos/i }),
    ).not.toBeInTheDocument()
  })

  it('should render the fab with its accessible label', () => {
    View({ lastUnlockedStarPosition: 'above' })

    expect(
      screen.getByRole('button', { name: 'Ir até a última estrela desbloqueada' }),
    ).toBeInTheDocument()
  })
})
