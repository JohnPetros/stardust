import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { GalaxiesPageView, type Props } from '../GalaxiesPageView'

jest.mock('../GalaxyItem', () => ({
  GalaxyItem: ({
    galaxy,
    isPending,
  }: {
    galaxy: GalaxySummaryDto
    isPending: boolean
  }) => (
    <div
      data-testid='galaxy-item'
      data-status={galaxy.status}
      data-pending={String(isPending)}
    >
      {galaxy.name}
    </div>
  ),
}))

const galaxies: GalaxySummaryDto[] = [
  {
    id: 'lp',
    slug: 'logica-de-programacao',
    name: 'Lógica de Programação',
    description: 'Descrição',
    animation: 'lp.json',
    position: 1,
    status: 'published',
    planetsCount: 10,
    completedPlanetsCount: 4,
    isCurrent: true,
  },
  {
    id: 'oo',
    slug: 'orientacao-a-objetos',
    name: 'Orientação a Objetos',
    description: 'Descrição',
    animation: 'oo.json',
    position: 2,
    status: 'announced',
    planetsCount: null,
    completedPlanetsCount: null,
    isCurrent: false,
  },
]

describe('GalaxiesPageView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <GalaxiesPageView
        backLabel='Voltar para Lógica de Programação'
        galaxies={galaxies}
        isLoading={false}
        hasError={false}
        pendingGalaxySlug={null}
        onBack={jest.fn()}
        onRetry={jest.fn()}
        onEnter={jest.fn()}
        {...props}
      />,
    )
  }

  describe('map', () => {
    it('should render the title and the subtitle', () => {
      View()

      expect(
        screen.getByRole('heading', { level: 1, name: 'Galáxias' }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('Cada galáxia é um curso. Escolha em qual você quer estudar.'),
      ).toBeInTheDocument()
    })

    it('should render the galaxies in the received order', () => {
      View()

      const items = screen.getAllByTestId('galaxy-item')

      expect(items.map((item) => item.textContent)).toEqual([
        'Lógica de Programação',
        'Orientação a Objetos',
      ])
    })

    it('should mark only the pending galaxy as pending', () => {
      View({ pendingGalaxySlug: 'logica-de-programacao' })

      const [first, second] = screen.getAllByTestId('galaxy-item')

      expect(first).toHaveAttribute('data-pending', 'true')
      expect(second).toHaveAttribute('data-pending', 'false')
    })

    it('should not render the loading nor the failure states', () => {
      View()

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(screen.queryByText('Tentar novamente')).not.toBeInTheDocument()
    })
  })

  describe('loading', () => {
    it('should render the loading status text and no galaxy', () => {
      View({ isLoading: true, galaxies: [] })

      expect(screen.getByRole('status')).toHaveTextContent('Carregando galáxias…')
      expect(screen.queryByTestId('galaxy-item')).not.toBeInTheDocument()
    })

    it('should not render invented progress while loading', () => {
      View({ isLoading: true, galaxies: [] })

      expect(screen.queryByText(/de \d+ planetas/)).not.toBeInTheDocument()
    })
  })

  describe('failure', () => {
    it('should render the failure texts and the retry button', () => {
      View({ hasError: true, galaxies: [] })

      expect(
        screen.getByText('Não foi possível carregar as galáxias'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'Verifique sua conexão e tente de novo. Seu progresso continua salvo.',
        ),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
    })

    it('should call onRetry when the retry button is clicked', async () => {
      const user = userEvent.setup()
      const onRetry = jest.fn()
      View({ hasError: true, galaxies: [], onRetry })

      await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('should not expose internal error details', () => {
      View({ hasError: true, galaxies: [] })

      expect(screen.queryByText(/error|exception|500/i)).not.toBeInTheDocument()
    })
  })

  describe('back action', () => {
    it.each([
      { state: 'map', props: {} },
      { state: 'loading', props: { isLoading: true } },
      { state: 'failure', props: { hasError: true } },
    ])(
      'should render the back action with the label in the $state state',
      ({ props }) => {
        View(props)

        expect(
          screen.getByRole('button', { name: 'Voltar para Lógica de Programação' }),
        ).toBeInTheDocument()
      },
    )

    it('should render only "Voltar" when the label has no galaxy name', () => {
      View({ backLabel: 'Voltar' })

      expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    })

    it('should call onBack when the back action is clicked', async () => {
      const user = userEvent.setup()
      const onBack = jest.fn()
      View({ onBack })

      await user.click(screen.getByRole('button', { name: /voltar/i }))

      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })
})
