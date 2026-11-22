import { render, screen } from '@testing-library/react'

import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import { Planet } from '@stardust/core/space/entities'

import { ROUTES } from '@/constants'
import { type Props, SpacePageView } from '../SpacePageView'

jest.mock('../Particles', () => ({
  Particles: () => <div data-testid='particles' />,
}))

jest.mock('../Planet', () => ({
  Planet: ({ planet }: { planet: { name: { value: string } } }) => (
    <div data-testid='planet'>{planet.name.value}</div>
  ),
}))

jest.mock('../StarDetails', () => ({
  StarDetails: () => <div data-testid='star-details-panel' />,
}))

jest.mock('../StarDetailsSheet', () => ({
  StarDetailsSheet: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid='star-details-sheet' data-open={String(isOpen)} />
  ),
}))

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: () => <div data-testid='animation' />,
}))

jest.mock('@/ui/global/widgets/components/Fab', () => ({
  Fab: ({
    label,
    isVisible,
    icon,
  }: {
    label: string
    isVisible: boolean
    icon: string
  }) =>
    isVisible ? (
      <button type='button' data-icon={icon}>
        {label}
      </button>
    ) : null,
}))

describe('SpacePageView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <SpacePageView
        status='ready'
        planets={PlanetsFaker.fakeMany(2).map((planet) => Planet.create(planet.dto))}
        galaxyName='Lógica de Programação'
        hasGalaxyChoice={true}
        shouldShowEnding={false}
        isMobile={false}
        isSheetOpen={false}
        isFabVisible={false}
        currentItemPosition='in'
        onFabClick={jest.fn()}
        onSheetClose={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render the galaxy control with a link to the galaxies page when there is a galaxy choice', () => {
    View()

    expect(
      screen.getByRole('link', { name: 'Lógica de Programação: ver galáxias' }),
    ).toHaveAttribute('href', ROUTES.galaxies)
  })

  it('should not render the galaxy control when there is no galaxy choice', () => {
    View({ hasGalaxyChoice: false })

    expect(screen.queryByRole('link', { name: /ver galáxias/i })).not.toBeInTheDocument()
  })

  it('should render the planets and the details panel on desktop', () => {
    View()

    expect(screen.getAllByTestId('planet')).toHaveLength(2)
    expect(screen.getByTestId('star-details-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('star-details-sheet')).not.toBeInTheDocument()
  })

  it('should render the bottom sheet instead of the panel on mobile', () => {
    View({ isMobile: true, isSheetOpen: true })

    expect(screen.queryByTestId('star-details-panel')).not.toBeInTheDocument()
    expect(screen.getByTestId('star-details-sheet')).toHaveAttribute('data-open', 'true')
  })

  it('should render the ending link when the trail is completed', () => {
    View({ shouldShowEnding: true })

    expect(screen.getByRole('link', { name: /Agradecimentos/ })).toHaveAttribute(
      'href',
      ROUTES.lesson.ending,
    )
  })

  it('should not render the ending link otherwise', () => {
    View({ shouldShowEnding: false })

    expect(screen.queryByRole('link', { name: /Agradecimentos/ })).not.toBeInTheDocument()
  })

  it('should render the fab pointing up when the current item is above', () => {
    View({ isFabVisible: true, currentItemPosition: 'above' })

    const fab = screen.getByRole('button', { name: 'Voltar à estrela atual' })
    expect(fab).toHaveAttribute('data-icon', 'arrow-up')
  })

  it('should render the fab pointing down when the current item is below', () => {
    View({ isFabVisible: true, currentItemPosition: 'below' })

    expect(
      screen.getByRole('button', { name: 'Voltar à estrela atual' }),
    ).toHaveAttribute('data-icon', 'arrow-down')
  })

  it('should not render the fab when it is not visible', () => {
    View({ isFabVisible: false })

    expect(
      screen.queryByRole('button', { name: 'Voltar à estrela atual' }),
    ).not.toBeInTheDocument()
  })

  it('should render the empty state without planets nor fab', () => {
    View({ status: 'empty', planets: [] })

    expect(
      screen.getByText('Nenhum conteúdo disponível nesta trilha.'),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('planet')).not.toBeInTheDocument()
  })

  it('should render the loading state without inventing progress', () => {
    View({ status: 'loading' })

    expect(screen.getByText('Carregando trilha…')).toBeInTheDocument()
    expect(screen.queryByTestId('planet')).not.toBeInTheDocument()
  })
})
