import { render, screen, waitFor } from '@testing-library/react'

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
