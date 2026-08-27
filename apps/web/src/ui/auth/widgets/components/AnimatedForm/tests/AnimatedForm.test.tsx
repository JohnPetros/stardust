import { render, screen } from '@testing-library/react'

import { AnimatedForm } from '..'

jest.mock('motion/react', () => ({
  motion: {
    div: ({ initial, animate, variants, ...props }: any) => (
      <div
        {...props}
        data-initial-variant={initial}
        data-animate-variant={animate}
        data-has-variants={Boolean(variants)}
      />
    ),
  },
}))

describe('AnimatedForm', () => {
  it('keeps the form mounted while animating it out', () => {
    const { rerender } = render(<AnimatedForm isVisible={false}>Conteúdo</AnimatedForm>)

    const animatedForm = screen.getByTestId('animated-form')

    rerender(<AnimatedForm isVisible>Conteúdo</AnimatedForm>)

    expect(screen.getByTestId('animated-form')).toBe(animatedForm)
    expect(animatedForm).toHaveAttribute('aria-hidden', 'true')
    expect(animatedForm).toHaveClass('pointer-events-none')
    expect(animatedForm).toHaveAttribute('data-animate-variant', 'hidden')
  })
})
