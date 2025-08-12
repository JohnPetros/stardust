import { render, screen } from '@testing-library/react'
import { AnimatedHeroView } from '../AnimatedHeroView'

describe('AnimatedHeroView', () => {
  it('should not render the hero when isVisible is false', () => {
    render(<AnimatedHeroView isVisible={false} />)

    const animatedHero = screen.getByTestId('animated-hero')

    expect(animatedHero).toBeVisible()
  })

  it('should render the hero when isVisible is true', () => {
    render(<AnimatedHeroView isVisible={true} />)

    const animatedHero = screen.queryByTestId('animated-hero')

    expect(animatedHero).toBeNull()
  })
})
