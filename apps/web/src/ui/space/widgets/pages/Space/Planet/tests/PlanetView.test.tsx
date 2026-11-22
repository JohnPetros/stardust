import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import { Planet } from '@stardust/core/space/entities'

import { type Props, PlanetView } from '../PlanetView'

jest.mock('../Star', () => ({
  Star: ({ name }: { name: { value: string } }) => (
    <div data-testid='star'>{name.value}</div>
  ),
}))

jest.mock('../PlanetLock', () => ({
  PlanetLock: ({ planetState, isJustOpened }: any) => (
    <div
      data-testid='planet-lock'
      data-state={planetState}
      data-just-opened={String(isJustOpened)}
    />
  ),
}))

describe('PlanetView', () => {
  const planet = Planet.create(PlanetsFaker.fakeDto())
  const onOpen = jest.fn()

  const View = (props?: Partial<Props>) => {
    const currentItemRef = { current: null }

    render(
      <PlanetView
        planetId={planet.id}
        name='Aurora'
        concept='Introdução'
        image='/planet.svg'
        state='opened'
        stars={planet.stars}
        completedStarsCount={1}
        starsCount={4}
        previousPlanetName={null}
        isOpenable={false}
        isOpening={false}
        isJustOpened={false}
        isCurrent={false}
        isAnimated={false}
        currentItemRef={currentItemRef}
        onOpen={onOpen}
        {...props}
      />,
    )

    return { currentItemRef }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the name, the concept, the progress and the stars of an opened planet', () => {
    View()

    expect(screen.getByText('Aurora')).toBeInTheDocument()
    expect(screen.getByText('Introdução')).toBeInTheDocument()
    expect(screen.getByText('1 de 4 estrelas concluídas')).toBeInTheDocument()
    expect(screen.getByText('1 de 4 concluídas')).toBeInTheDocument()
    expect(screen.getByText('Aberto')).toBeInTheDocument()
    expect(screen.getAllByTestId('star')).toHaveLength(planet.stars.length)
  })

  it('should not be a button when the planet is opened', () => {
    View({ state: 'opened' })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render a single button with the next step and the open label when liberated', async () => {
    const user = userEvent.setup()
    View({ state: 'liberated', isOpenable: true })

    const button = screen.getByRole('button', { name: 'Abrir planeta Aurora' })
    await user.click(button)

    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByText('Próximo passo')).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-busy', 'false')
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('should mark the button as busy while the planet is opening', () => {
    View({ state: 'liberated', isOpenable: true, isOpening: true })

    expect(screen.getByRole('button', { name: 'Abrir planeta Aurora' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
  })

  it('should tell which planet must be completed when the planet is locked', () => {
    View({ state: 'locked', previousPlanetName: 'Trívia', isOpenable: false })

    expect(screen.getByText(/Conclua Trívia para liberar/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should serve the art of the animated planet as is, so its frames are kept', () => {
    const image = 'https://cdn.stardust.dev/images/planets/planet-aurora-image.webp'
    View({ image, isAnimated: true })

    const art = document.querySelector(`img[src="${image}"]`)
    expect(art).toBeInTheDocument()
  })

  it('should send the art of the other planets through the image optimizer', () => {
    const image = 'https://cdn.stardust.dev/images/planets/planet-aurora-image.webp'
    View({ image, isAnimated: false })

    expect(document.querySelector(`img[src="${image}"]`)).not.toBeInTheDocument()
    expect(document.querySelector('img[src*="/_next/image"]')).toBeInTheDocument()
  })

  it('should pass the state and the just opened flag to the lock', () => {
    View({ state: 'opened', isJustOpened: true })

    expect(screen.getByTestId('planet-lock')).toHaveAttribute('data-state', 'opened')
    expect(screen.getByTestId('planet-lock')).toHaveAttribute('data-just-opened', 'true')
  })

  it('should attach the current item ref only when the planet is the current item', () => {
    expect(View({ isCurrent: true }).currentItemRef.current).toBeInstanceOf(
      HTMLDivElement,
    )
    expect(View({ isCurrent: false }).currentItemRef.current).toBeNull()
  })

  it('should show the progress of the previous planet on the locked plaque without a button', () => {
    View({
      state: 'locked',
      previousPlanetName: 'Trívia',
      completedStarsCount: 0,
      isOpenable: false,
    })

    expect(screen.getByText(/Conclua Trívia para liberar · 0 de 4/)).toBeInTheDocument()
    expect(screen.queryByText('Próximo passo')).not.toBeInTheDocument()
  })

  it('should render the open label as part of the single button when liberated', () => {
    View({ state: 'liberated', isOpenable: true })

    const button = screen.getByRole('button', { name: 'Abrir planeta Aurora' })
    expect(button).toContainElement(screen.getByText('Abrir planeta'))
    expect(button.querySelectorAll('button')).toHaveLength(0)
  })
})
