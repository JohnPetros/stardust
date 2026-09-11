import { render } from '@testing-library/react'
import type { PropsWithChildren } from 'react'

import { ToastView } from '../ToastView'

jest.mock('@radix-ui/react-toast', () => {
  return {
    Root: ({ children }: PropsWithChildren) => children,
    Description: ({ children, className }: PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
    Close: ({ children, asChild }: PropsWithChildren<{ asChild?: boolean }>) =>
      asChild ? children : <button type='button'>{children}</button>,
  }
})

jest.mock('motion/react', () => {
  const React = jest.requireActual('react') as typeof import('react')
  const MotionDiv = React.forwardRef<
    HTMLDivElement,
    PropsWithChildren<{ className?: string }>
  >(({ children, className }, ref) => (
    <div ref={ref} className={className}>
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
    const { container, rerender } = render(
      <ToastView {...defaultProps} animationKey={0} />,
    )
    const firstProgressBar = container.querySelector('div.w-full.rounded')

    rerender(<ToastView {...defaultProps} animationKey={1} />)
    const secondProgressBar = container.querySelector('div.w-full.rounded')

    expect(firstProgressBar).not.toBeNull()
    expect(secondProgressBar).not.toBe(firstProgressBar)
  })
})
