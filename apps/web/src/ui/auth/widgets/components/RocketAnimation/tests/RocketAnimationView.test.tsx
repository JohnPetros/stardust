import { render, screen, waitFor } from '@testing-library/react'

jest.mock('motion/react', () => ({
  motion: {
    div: ({ variants, initial, animate, style, ...props }: any) => {
      const initialVariant = initial ? variants?.[initial] : undefined
      const animateVariant = animate ? variants?.[animate] : undefined

      return (
        <div
          {...props}
          style={{
            ...style,
            opacity: animateVariant?.opacity ?? initialVariant?.opacity,
          }}
        />
      )
    },
  },
}))

import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { RocketAnimationView } from '../RocketAnimationView'

describe('RocketAnimationView', () => {
  it('should render the rocket animation with opacity 0 when isVisible is false', async () => {
    render(<RocketAnimationView animationRef={animationRefMock} isVisible={false} />)

    const rocketAnimation = screen.getByTestId('rocket-animation')

    await waitFor(() => {
      expect(rocketAnimation).toHaveStyle({
        opacity: 0,
      })
    })
  })

  it('should render the rocket animation with opacity 1 when isVisible is true', async () => {
    render(<RocketAnimationView animationRef={animationRefMock} isVisible={true} />)

    const rocketAnimation = screen.getByTestId('rocket-animation')

    await waitFor(
      () => {
        expect(rocketAnimation).toHaveStyle({
          opacity: 1,
        })
      },
      {
        timeout: 3000,
      },
    )
  })
})
