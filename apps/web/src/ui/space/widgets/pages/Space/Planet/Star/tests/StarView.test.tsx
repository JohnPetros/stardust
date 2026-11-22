import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { type Props, StarView } from '../StarView'

jest.mock('../AnimatedImage', () => ({
  AnimatedImage: ({ children, shouldAnimate }: any) => (
    <div data-testid='animated-image' data-should-animate={String(shouldAnimate)}>
      {children}
    </div>
  ),
}))

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: ({ name }: any) => <div data-testid='star-animation'>{name}</div>,
}))

describe('StarView', () => {
  const onSelect = jest.fn()
  const onClick = jest.fn()

  const View = (props?: Partial<Props>) => {
    const currentItemRef = { current: null }

    render(
      <StarView
        id='star-id'
        name='Variáveis'
        number={3}
        state='available'
        isCurrent={false}
        isSelected={false}
        isAccessible={true}
        isChallenge={false}
        typeLabel='História'
        stateLabel='Disponível'
        unlockHint={null}
        currentItemRef={currentItemRef}
        starAnimationRef={{ current: null }}
        onSelect={onSelect}
        onClick={onClick}
        {...props}
      />,
    )

    return { currentItemRef }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render an available star as a button with name, type and state', () => {
    View()

    expect(
      screen.getByRole('button', { name: 'Estrela 3: Variáveis, História, Disponível' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Disponível')).toBeInTheDocument()
    expect(screen.getByTestId('star-animation')).toHaveTextContent('unlocked-star')
  })

  it('should render a completed star with the completed state', () => {
    View({ state: 'completed', stateLabel: 'Concluída' })

    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })

  it('should render a locked star without a button and with the unlock condition', () => {
    View({
      state: 'locked',
      isAccessible: false,
      stateLabel: null,
      unlockHint: 'Conclua a estrela 2 para liberar',
    })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Conclua a estrela 2 para liberar')).toBeInTheDocument()
    expect(screen.queryByTestId('star-animation')).not.toBeInTheDocument()
  })

  it('should show the type label of a challenge star', () => {
    View({ isChallenge: true, typeLabel: 'Desafio de código' })

    expect(screen.getByText('Desafio de código')).toBeInTheDocument()
  })

  it('should not render the new content indicator nor a rocket', () => {
    View({ isCurrent: true })

    expect(screen.queryByText('Conteúdo novo')).not.toBeInTheDocument()
    expect(screen.queryByAltText(/foguete/i)).not.toBeInTheDocument()
  })

  it('should attach the current item ref only to the current star', () => {
    const { currentItemRef } = View({ isCurrent: true })

    expect(currentItemRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should not attach the current item ref to other stars', () => {
    const { currentItemRef } = View({ isCurrent: false })

    expect(currentItemRef.current).toBeNull()
  })

  it('should select on hover and focus and call onClick on click', async () => {
    const user = userEvent.setup()
    View()
    const button = screen.getByRole('button')

    await user.hover(button)
    button.focus()
    await user.click(button)

    expect(onSelect).toHaveBeenCalledTimes(2)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should keep the state tone by text and icon, with the glow only on the available star', () => {
    View()

    const card = screen.getByText('Disponível').closest('div')
    expect(card).toHaveClass('border-theme-reward', 'bg-theme-surface')
    expect(card).not.toHaveClass('border-dashed')
    expect(card).toHaveStyle({ boxShadow: '0 0 12px #ffcf31a1' })
    expect(
      screen.getByText('Disponível').querySelector('[aria-hidden="true"]'),
    ).not.toBeNull()
  })

  it('should use the success border without glow on a completed star', () => {
    View({ state: 'completed', stateLabel: 'Concluída' })

    const card = screen.getByText('Concluída').closest('div')
    expect(card).toHaveClass('border-theme-success')
    expect(card?.style.boxShadow).toBe('')
  })

  it('should use the quiet border without glow on a locked star', () => {
    View({
      state: 'locked',
      isAccessible: false,
      stateLabel: null,
      unlockHint: 'Conclua a estrela 2 para liberar',
    })

    const card = screen.getByText('Conclua a estrela 2 para liberar').closest('div')
    expect(card).toHaveClass('border-theme-border-quiet')
    expect(card?.style.boxShadow).toBe('')
  })
})
