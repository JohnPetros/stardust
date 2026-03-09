import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { StarView } from '../StarView'

jest.mock('../AnimatedImage', () => ({
  AnimatedImage: ({ children, shouldAnimate }: any) => (
    <div data-testid='animated-image' data-should-animate={String(shouldAnimate)}>
      {children}
    </div>
  ),
}))

jest.mock('../AnimatedRocket', () => ({
  AnimatedRocket: ({ shouldAnimate }: any) => (
    <div data-testid='animated-rocket' data-should-animate={String(shouldAnimate)} />
  ),
}))

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: ({ name }: any) => <div data-testid='star-animation'>{name}</div>,
}))

jest.mock('@/ui/global/widgets/components/ShinyText', () => ({
  ShinyText: ({ text }: any) => <span>{text}</span>,
}))

describe('StarView', () => {
  type Props = ComponentProps<typeof StarView>

  const onClick = jest.fn()
  const starAnimationRef = { current: null }

  const View = (props?: Partial<Props>) => {
    const lastUnlockedStarRef = { current: null }

    render(
      <StarView
        name='Variaveis'
        number={3}
        isUnlocked={true}
        isRecentlyUnlocked={false}
        isLastUnlockedStar={false}
        lastUnlockedStarRef={lastUnlockedStarRef}
        starAnimationRef={starAnimationRef}
        onClick={onClick}
        {...props}
      />,
    )

    return {
      lastUnlockedStarRef,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call onClick when unlocked star button is clicked', async () => {
    const user = userEvent.setup()
    View()

    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalled()
  })

  it('should disable star button when star is locked', () => {
    View({ isUnlocked: false })

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should render unlocked assets when star is unlocked', () => {
    View({ isUnlocked: true, isLastUnlockedStar: true })

    expect(screen.getByTestId('animated-image')).toBeInTheDocument()
    expect(screen.getByTestId('star-animation')).toHaveTextContent('unlocked-star')
    expect(screen.getByTestId('animated-rocket')).toHaveAttribute(
      'data-should-animate',
      'true',
    )
  })

  it('should render recently unlocked label when star is recently unlocked', () => {
    View({ isRecentlyUnlocked: true, isUnlocked: true })

    expect(screen.getByText('Conteúdo novo')).toBeInTheDocument()
  })

  it('should attach last unlocked ref when star is the last unlocked one', () => {
    const { lastUnlockedStarRef } = View({ isLastUnlockedStar: true })

    expect(lastUnlockedStarRef.current).not.toBeNull()
  })
})
