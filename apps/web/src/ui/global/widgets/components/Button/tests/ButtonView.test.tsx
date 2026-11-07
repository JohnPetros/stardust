import { createRef } from 'react'
import { render, screen } from '@testing-library/react'

import { ButtonView } from '../ButtonView'

jest.mock('../../Loading', () => ({
  Loading: () => <div data-testid='loading' />,
}))

jest.mock('motion/react', () => {
  const React = jest.requireActual('react') as typeof import('react')
  const MotionButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'> & { whileTap?: unknown }
  >(({ whileTap, children, ...props }, ref) => (
    <button ref={ref} data-while-tap={JSON.stringify(whileTap)} {...props}>
      {children}
    </button>
  ))

  return { motion: { button: MotionButton } }
})

describe('ButtonView', () => {
  it('should render its children as a button that does not submit forms by default', () => {
    render(<ButtonView>Entrar</ButtonView>)

    const button = screen.getByRole('button', { name: 'Entrar' })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).not.toBeDisabled()
  })

  it('should use the control tokens of the primary button', () => {
    render(<ButtonView>Entrar</ButtonView>)

    const button = screen.getByRole('button', { name: 'Entrar' })

    expect(button).toHaveClass(
      'h-theme-control',
      'rounded-theme',
      'bg-theme-action',
      'text-theme-canvas',
      'text-sm',
      'font-medium',
    )
  })

  it('should show a visible keyboard focus outline using the action color', () => {
    render(<ButtonView>Entrar</ButtonView>)

    const button = screen.getByRole('button', { name: 'Entrar' })

    expect(button).toHaveClass(
      'focus-visible:outline',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-theme-action',
    )
    expect(button).not.toHaveClass('custom-outline')
  })

  it('should keep the press feedback', () => {
    render(<ButtonView>Entrar</ButtonView>)

    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute(
      'data-while-tap',
      JSON.stringify({ scale: 0.99 }),
    )
  })

  it('should expose the test id as data-testid', () => {
    render(<ButtonView testId='submit-button'>Entrar</ButtonView>)

    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('should forward the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>()

    render(<ButtonView ref={ref}>Entrar</ButtonView>)

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Entrar' }))
  })

  it('should be disabled and keep the disabled styles when disabled', () => {
    render(<ButtonView disabled>Entrar</ButtonView>)

    const button = screen.getByRole('button', { name: 'Entrar' })

    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-70')
  })

  it('should render the spinner instead of the children and be disabled when loading', () => {
    render(<ButtonView isLoading>Entrar</ButtonView>)

    const button = screen.getByRole('button')

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('should let the className of the caller override height, radius and color', () => {
    render(
      <ButtonView className='h-8 rounded-full bg-red-700 text-gray-100'>
        Entrar
      </ButtonView>,
    )

    const button = screen.getByRole('button', { name: 'Entrar' })

    expect(button).toHaveClass('h-8', 'rounded-full', 'bg-red-700', 'text-gray-100')
    expect(button).not.toHaveClass(
      'h-theme-control',
      'rounded-theme',
      'bg-theme-action',
      'text-theme-canvas',
    )
  })

  it('should let the caller override the radius with a theme radius token', () => {
    render(<ButtonView className='rounded-theme-full'>Entrar</ButtonView>)

    const button = screen.getByRole('button', { name: 'Entrar' })

    expect(button).toHaveClass('rounded-theme-full')
    expect(button).not.toHaveClass('rounded-theme')
  })

  it('should apply the styles to the child element when asChild is true', () => {
    render(
      <ButtonView asChild testId='ignored'>
        <a href='/space'>Ir para o espaço</a>
      </ButtonView>,
    )

    const link = screen.getByRole('link', { name: 'Ir para o espaço' })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/space')
    expect(link).toHaveClass('h-theme-control', 'rounded-theme', 'bg-theme-action')
  })
})
