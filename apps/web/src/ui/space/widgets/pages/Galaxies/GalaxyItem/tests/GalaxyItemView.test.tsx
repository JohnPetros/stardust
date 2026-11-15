import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { GalaxyItemView, type Props } from '../GalaxyItemView'

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: ({ src, isStatic }: { src: string; isStatic: boolean }) => (
    <div data-testid='animation' data-src={src} data-is-static={String(isStatic)} />
  ),
}))

const publishedGalaxy: GalaxySummaryDto = {
  id: 'galaxy-id',
  slug: 'logica-de-programacao',
  name: 'Lógica de Programação',
  description: 'Aprenda a pensar como quem programa.',
  animation: 'logica-de-programacao.json',
  position: 1,
  status: 'published',
  planetsCount: 10,
  completedPlanetsCount: 4,
  isCurrent: false,
}

const announcedGalaxy: GalaxySummaryDto = {
  ...publishedGalaxy,
  id: 'announced-id',
  slug: 'orientacao-a-objetos',
  name: 'Orientação a Objetos',
  description: 'Organize programas em classes e objetos.',
  status: 'announced',
  planetsCount: null,
  completedPlanetsCount: null,
}

describe('GalaxyItemView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <GalaxyItemView
        galaxy={publishedGalaxy}
        side='start'
        animationUrl='http://cdn/lotties/galaxies/logica-de-programacao.json'
        isAnimationStatic={false}
        isPending={false}
        onEnter={jest.fn()}
        {...props}
      />,
    )
  }

  describe('published galaxy', () => {
    it('should render a button whose accessible name holds the visible name and progress', () => {
      View()

      expect(
        screen.getByRole('button', {
          name: /Lógica de Programação.*4 de 10 planetas/,
        }),
      ).toBeInTheDocument()
    })

    it('should render name, description and the progress text', () => {
      View()

      expect(screen.getByText('Lógica de Programação')).toBeInTheDocument()
      expect(screen.getByText('Aprenda a pensar como quem programa.')).toBeInTheDocument()
      expect(screen.getByText('4 de 10 planetas')).toBeInTheDocument()
    })

    it('should fill the progress bar proportionally to the completed planets', () => {
      View()

      const bar =
        screen.getByText('4 de 10 planetas').previousElementSibling?.firstElementChild

      expect(bar).toHaveStyle({ width: '40%' })
    })

    it('should call onEnter with the galaxy when it is clicked', async () => {
      const user = userEvent.setup()
      const onEnter = jest.fn()
      View({ onEnter })

      await user.click(screen.getByRole('button'))

      expect(onEnter).toHaveBeenCalledWith(publishedGalaxy)
    })

    it('should be activated with the keyboard', async () => {
      const user = userEvent.setup()
      const onEnter = jest.fn()
      View({ onEnter })

      await user.tab()
      await user.keyboard('{Enter}')

      expect(screen.getByRole('button')).toHaveFocus()
      expect(onEnter).toHaveBeenCalledTimes(1)
    })

    it('should be busy only while the entry is pending', () => {
      View({ isPending: true })

      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('should not be busy when the entry is not pending', () => {
      View({ isPending: false })

      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
    })

    it('should not render the current chip when it is not the current galaxy', () => {
      View()

      expect(screen.queryByText('Você está aqui')).not.toBeInTheDocument()
    })

    it('should render the current chip when it is the current galaxy', () => {
      View({ galaxy: { ...publishedGalaxy, isCurrent: true } })

      expect(screen.getByText('Você está aqui')).toBeInTheDocument()
    })

    it('should pass the animation url to the animation', () => {
      View()

      expect(screen.getByTestId('animation')).toHaveAttribute(
        'data-src',
        'http://cdn/lotties/galaxies/logica-de-programacao.json',
      )
    })

    it('should make the animation static when the prop is true', () => {
      View({ isAnimationStatic: true })

      expect(screen.getByTestId('animation')).toHaveAttribute('data-is-static', 'true')
      expect(screen.getByTestId('galaxy-animation')).toHaveAttribute(
        'data-static',
        'true',
      )
    })

    it('should keep the animation playing when the prop is false', () => {
      View({ isAnimationStatic: false })

      expect(screen.getByTestId('animation')).toHaveAttribute('data-is-static', 'false')
    })
  })

  describe('announced galaxy', () => {
    const AnnouncedView = (props?: Partial<Props>) =>
      View({ galaxy: announcedGalaxy, isAnimationStatic: true, ...props })

    it('should render the "Em breve" chip, name and description accessibly', () => {
      AnnouncedView()

      expect(screen.getByText('Em breve')).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Orientação a Objetos' }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('Organize programas em classes e objetos.'),
      ).toBeInTheDocument()
    })

    it('should render an article and no button', () => {
      AnnouncedView()

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should not receive focus with the keyboard', async () => {
      const user = userEvent.setup()
      AnnouncedView()

      await user.tab()

      expect(document.body).toHaveFocus()
    })

    it('should not call onEnter when it is clicked', async () => {
      const user = userEvent.setup()
      const onEnter = jest.fn()
      AnnouncedView({ onEnter })

      await user.click(screen.getByRole('article'))

      expect(onEnter).not.toHaveBeenCalled()
    })

    it('should not render progress', () => {
      AnnouncedView()

      expect(screen.queryByText(/planetas/)).not.toBeInTheDocument()
    })

    it('should not render the current chip ', () => {
      AnnouncedView()

      expect(screen.queryByText('Você está aqui')).not.toBeInTheDocument()
    })

    it('should render a static dimmed animation', () => {
      AnnouncedView()

      expect(screen.getByTestId('galaxy-animation')).toHaveAttribute(
        'data-static',
        'true',
      )
      expect(screen.getByTestId('galaxy-animation').className).toContain('opacity-20')
    })
  })
})
