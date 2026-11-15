import { render, screen } from '@testing-library/react'

import { LottieAnimationView } from '../LottieAnimationView'

jest.mock(
  'next/dynamic',
  () => () =>
    function LottieMock(props: {
      animationData: unknown
      style: Record<string, unknown>
      autoplay: boolean
      loop: boolean
    }) {
      return (
        <div
          data-testid='lottie'
          data-autoplay={String(props.autoplay)}
          data-loop={String(props.loop)}
          data-style={JSON.stringify(props.style)}
        />
      )
    },
)

describe('LottieAnimationView', () => {
  const View = (props?: Partial<Parameters<typeof LottieAnimationView>[0]>) =>
    render(
      <LottieAnimationView
        lottieRef={{ current: null }}
        lottieData={{ v: '5.0.0' }}
        size={200}
        windowWidth={1280}
        autoplay
        loop
        {...props}
      />,
    )

  it('should render nothing while the lottie data is not available', () => {
    View({ lottieData: null })

    expect(screen.queryByTestId('lottie')).not.toBeInTheDocument()
  })

  it('should render a square animation limited by the viewport for a numeric size', () => {
    View({ size: 200 })

    const style = JSON.parse(screen.getByTestId('lottie').dataset.style as string)
    expect(style).toMatchObject({
      width: 'min(200px, 100vw, 100vh)',
      height: 'min(200px, 100vw, 100vh)',
    })
  })

  it('should render the animation with the window width for the full size', () => {
    View({ size: 'full', windowWidth: 900 })

    const style = JSON.parse(screen.getByTestId('lottie').dataset.style as string)
    expect(style).toMatchObject({ width: 900, top: 0, left: 0 })
  })

  it('should forward the autoplay and loop flags', () => {
    View({ autoplay: false, loop: false })

    const lottie = screen.getByTestId('lottie')
    expect(lottie.dataset.autoplay).toBe('false')
    expect(lottie.dataset.loop).toBe('false')
  })
})
