import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'

import { ToastView } from '../ToastView'

jest.mock('@radix-ui/react-toast', () => {
  return {
    Root: ({ children }: PropsWithChildren) => children,
    Description: ({ children, className }: PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
    Close: ({
      children,
      asChild,
      'aria-label': ariaLabel,
    }: PropsWithChildren<{ asChild?: boolean; 'aria-label'?: string }>) => {
      const React = jest.requireActual('react') as typeof import('react')

      return asChild && React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<{ 'aria-label'?: string }>, {
          'aria-label': ariaLabel,
        })
      ) : (
        <button type='button' aria-label={ariaLabel}>
          {children}
        </button>
      )
    },
  }
})

jest.mock('motion/react', () => {
  const React = jest.requireActual('react') as typeof import('react')
  const MotionDiv = React.forwardRef<
    HTMLDivElement,
    PropsWithChildren<{ className?: string; 'data-testid'?: string }>
  >(({ children, className, 'data-testid': testId }, ref) => (
    <div ref={ref} className={className} data-testid={testId}>
      {children}
    </div>
  ))

  return {
    AnimatePresence: ({ children }: PropsWithChildren) => <>{children}</>,
    motion: { div: MotionDiv },
  }
})

describe('ToastView', () => {
  const defaultProps = {
    type: 'error' as const,
    message: 'E-mail ou senha incorretos',
    seconds: 2.5,
    isOpen: true,
    scope: { current: null },
    onClose: jest.fn(),
    onDragEnd: jest.fn(),
  }

  it('remounts the progress bar when the animation key changes', () => {
    const { rerender } = render(<ToastView {...defaultProps} animationKey={0} />)
    const firstProgressBar = screen.getByTestId('toast-progress-bar')

    rerender(<ToastView {...defaultProps} animationKey={1} />)
    const secondProgressBar = screen.getByTestId('toast-progress-bar')

    expect(firstProgressBar).not.toBeNull()
    expect(secondProgressBar).not.toBe(firstProgressBar)
  })

  it('renders the message', () => {
    render(<ToastView {...defaultProps} animationKey={0} />)

    expect(screen.getByText('E-mail ou senha incorretos')).toHaveClass(
      'text-sm',
      'font-normal',
    )
  })

  it('renders the surface, border and radius tokens of the toast', () => {
    const { container } = render(<ToastView {...defaultProps} animationKey={0} />)

    expect(container.firstElementChild).toHaveClass(
      'bg-theme-surface',
      'border-theme-border-quiet',
      'rounded-theme',
      'w-[min(360px,90vw)]',
    )
  })

  it('uses the danger colors for the error type', () => {
    const { container } = render(
      <ToastView {...defaultProps} type='error' animationKey={0} />,
    )

    expect(container.querySelector('span.size-6')).toHaveClass(
      'bg-theme-danger-surface',
      'text-theme-danger',
    )
    expect(screen.getByTestId('toast-progress-bar').firstElementChild).toHaveClass(
      'h-1',
      'bg-theme-danger',
    )
  })

  it('uses the success colors for the success type', () => {
    const { container } = render(
      <ToastView {...defaultProps} type='success' animationKey={0} />,
    )

    expect(container.querySelector('span.size-6')).toHaveClass(
      'bg-theme-success-surface',
      'text-theme-success',
    )
    expect(screen.getByTestId('toast-progress-bar').firstElementChild).toHaveClass(
      'h-1',
      'bg-theme-success',
    )
  })

  it('renders the close button with an accessible name, calls onClose and shows a focus outline', async () => {
    const onClose = jest.fn()
    render(<ToastView {...defaultProps} onClose={onClose} animationKey={0} />)

    const closeButton = screen.getByRole('button', { name: 'Fechar mensagem' })

    expect(closeButton).toHaveClass(
      'focus-visible:outline',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-theme-action',
    )

    closeButton.click()

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render the toast when it is closed', () => {
    render(<ToastView {...defaultProps} isOpen={false} animationKey={0} />)

    expect(screen.queryByText('E-mail ou senha incorretos')).not.toBeInTheDocument()
  })
})
