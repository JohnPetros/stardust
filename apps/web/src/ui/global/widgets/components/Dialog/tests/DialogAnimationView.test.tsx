import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

import { DialogAnimationView } from '../DialogAnimationView'

jest.mock('motion/react', () => {
  const React = jest.requireActual('react') as typeof import('react')
  const MotionDiv = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
      variants?: unknown
      initial?: unknown
      animate?: unknown
      exit?: unknown
    }
  >(({ variants, initial, animate, exit, children, ...props }, ref) => (
    <div
      ref={ref}
      data-testid='dialog-surface'
      data-initial={String(initial)}
      data-animate={String(animate)}
      data-exit={String(exit)}
      {...props}
    >
      {children}
    </div>
  ))

  return { motion: { div: MotionDiv } }
})

describe('DialogAnimationView', () => {
  const View = (props?: Partial<ComponentProps<typeof DialogAnimationView>>) => {
    return render(
      <DialogAnimationView {...props}>
        {props?.children ?? <p>Conteúdo do diálogo</p>}
      </DialogAnimationView>,
    )
  }

  it('should render its children inside the dialog surface', () => {
    View()

    const surface = screen.getByTestId('dialog-surface')

    expect(surface).toContainElement(screen.getByText('Conteúdo do diálogo'))
  })

  it('should use the surface tokens of the theme', () => {
    View()

    expect(screen.getByTestId('dialog-surface')).toHaveClass(
      'rounded-theme',
      'border-theme-control',
      'border-theme-border-quiet',
      'bg-theme-surface',
      'p-6',
    )
  })

  it('should animate from the closed state to the open state and back', () => {
    View()

    const surface = screen.getByTestId('dialog-surface')

    expect(surface).toHaveAttribute('data-initial', 'close')
    expect(surface).toHaveAttribute('data-animate', 'open')
    expect(surface).toHaveAttribute('data-exit', 'close')
  })

  it('should let the caller class name override conflicting utilities', () => {
    View({ className: 'p-0 rounded-theme-full custom-surface' })

    const surface = screen.getByTestId('dialog-surface')

    expect(surface).toHaveClass('p-0', 'rounded-theme-full', 'custom-surface')
    expect(surface).not.toHaveClass('p-6')
    expect(surface).not.toHaveClass('rounded-theme')
  })
})
