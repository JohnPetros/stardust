import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PropsWithChildren } from 'react'

import { AlertDialogView, type AlertDialogViewProps } from '../AlertDialogView'

jest.mock('@radix-ui/react-alert-dialog', () => {
  const Passthrough = ({ children }: PropsWithChildren) => <>{children}</>

  return {
    Root: ({
      children,
      open,
      onOpenChange,
    }: PropsWithChildren<{ open: boolean; onOpenChange: (isOpen: boolean) => void }>) => (
      <div data-testid='root' data-open={String(open)}>
        <button type='button' onClick={() => onOpenChange(false)}>
          request-close
        </button>
        {children}
      </div>
    ),
    Portal: Passthrough,
    Overlay: ({ onClick, className }: { onClick?: () => void; className?: string }) => (
      <button
        type='button'
        aria-label='overlay'
        data-testid='overlay'
        className={className}
        onClick={onClick}
      />
    ),
    Content: ({
      children,
      className,
      forceMount,
    }: PropsWithChildren<{ className?: string; forceMount?: boolean }>) => (
      <div
        data-testid='content'
        data-force-mount={String(Boolean(forceMount))}
        className={className}
      >
        {children}
      </div>
    ),
    Title: ({ children, className }: PropsWithChildren<{ className?: string }>) => (
      <h2 className={className}>{children}</h2>
    ),
    AlertDialogAction: Passthrough,
    AlertDialogCancel: Passthrough,
    Trigger: Passthrough,
  }
})

jest.mock('../../Hydration', () => ({
  Hydration: ({ children }: PropsWithChildren) => <>{children}</>,
}))

jest.mock('../../Animation', () => ({
  Animation: ({ name }: { name: string }) => <div data-testid={`animation-${name}`} />,
}))

jest.mock('../../Dialog', () => ({
  Animation: ({ children }: PropsWithChildren) => (
    <div data-testid='dialog-surface'>{children}</div>
  ),
}))

describe('AlertDialogView', () => {
  const View = (props?: Partial<AlertDialogViewProps>) => {
    const onOpenChange = jest.fn()

    render(
      <AlertDialogView
        type='generic'
        title='Senha redefinida'
        body={<p>Agora você pode entrar com a nova senha.</p>}
        action={<button type='button'>Entrar</button>}
        animation={null}
        isRendered={true}
        isOpen={true}
        containerRef={{ current: document.body }}
        onOpenChange={onOpenChange}
        {...props}
      />,
    )

    return { onOpenChange }
  }

  it('should render the title centered with the theme text color and a quiet divider', () => {
    View()

    const title = screen.getByRole('heading', { name: 'Senha redefinida' })

    expect(title).toHaveClass('text-center', 'font-semibold', 'text-theme-text-primary')
    expect(title.parentElement).toHaveClass('border-b', 'border-theme-border-quiet')
  })

  it('should render the body and the action', () => {
    View()

    expect(screen.getByText('Agora você pode entrar com a nova senha.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeVisible()
  })

  it('should not render a cancel element by default', () => {
    View()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('should render the optional cancel element when provided', () => {
    View({ cancel: <button type='button'>Cancelar</button> })

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeVisible()
  })

  it('should render the animation when the dialog type has one', () => {
    View({ animation: 'apollo-earning' })

    expect(screen.getByTestId('animation-apollo-earning')).toBeInTheDocument()
  })

  it('should not render an animation when the dialog type has none', () => {
    View({ animation: null })

    expect(screen.queryByTestId(/^animation-/)).not.toBeInTheDocument()
  })

  it('should render the content inside the dialog surface', () => {
    View()

    expect(screen.getByTestId('dialog-surface')).toContainElement(
      screen.getByRole('heading', { name: 'Senha redefinida' }),
    )
  })

  it('should render the trigger passed as children', () => {
    View({ children: <button type='button'>Abrir alerta</button> })

    expect(screen.getByRole('button', { name: 'Abrir alerta' })).toBeInTheDocument()
  })

  it('should keep the existing overlay', () => {
    View()

    expect(screen.getByTestId('overlay')).toHaveClass(
      'fixed',
      'inset-0',
      'z-[1000]',
      'bg-black',
      'bg-opacity-50',
    )
  })

  it('should delegate open changes to onOpenChange', async () => {
    const { onOpenChange } = View()

    await userEvent.click(screen.getByRole('button', { name: 'request-close' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should close when the overlay is clicked only if shouldCloseOnInteractOutside is true', async () => {
    const { onOpenChange } = View({ shouldCloseOnInteractOutside: true })

    await userEvent.click(screen.getByTestId('overlay'))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should not close when the overlay is clicked by default', async () => {
    const { onOpenChange } = View()

    await userEvent.click(screen.getByTestId('overlay'))

    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('should size the dialog surface to 512px by compensating the viewport padding', () => {
    View()

    expect(screen.getByTestId('content')).toHaveClass(
      'w-full',
      'max-w-[calc(512px+3rem)]',
      'p-6',
    )
  })

  it('should force mount the content only when requested', () => {
    View({ shouldForceMount: true })

    expect(screen.getByTestId('content')).toHaveAttribute('data-force-mount', 'true')
  })
})
