import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cloneElement, forwardRef, useImperativeHandle } from 'react'

const open = jest.fn()
const close = jest.fn()

jest.mock('@/ui/global/widgets/components/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/AlertDialog', () => ({
  AlertDialog: forwardRef(function MockAlertDialog(
    { title, body, action, cancel, shouldPlayAudio, onOpenChange }: any,
    ref,
  ) {
    useImperativeHandle(ref, () => ({ open, close }), [])
    const withCloseNotification = (element: any) =>
      cloneElement(element, {
        onClick: (...args: any[]) => {
          element.props.onClick?.(...args)
          onOpenChange(false)
        },
      })
    return (
      <div
        data-testid='alert-dialog'
        data-should-play-audio={String(shouldPlayAudio)}
        data-on-open-change={String(Boolean(onOpenChange))}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onOpenChange(false)
        }}
      >
        <h1>{title}</h1>
        {body}
        {withCloseNotification(action)}
        {withCloseNotification(cancel)}
      </div>
    )
  }),
}))

import { UnsavedChangesDialogView } from '../UnsavedChangesDialogView'

describe('UnsavedChangesDialogView', () => {
  it('renders an accessible safe action first and disables audio', async () => {
    const user = userEvent.setup()
    const onContinueEditing = jest.fn()
    const onLeaveWithoutSaving = jest.fn()

    render(
      <UnsavedChangesDialogView
        dialogRef={{ current: null }}
        isOpen={true}
        onContinueEditing={onContinueEditing}
        onLeaveWithoutSaving={onLeaveWithoutSaving}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Sair sem salvar?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar editando' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair sem salvar' })).toBeInTheDocument()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Continuar editando' }),
    )
    expect(screen.getByTestId('alert-dialog')).toHaveAttribute(
      'data-should-play-audio',
      'false',
    )

    await user.click(screen.getByRole('button', { name: 'Continuar editando' }))
    await user.click(screen.getByRole('button', { name: 'Sair sem salvar' }))

    expect(onContinueEditing).toHaveBeenCalledTimes(1)
    expect(onLeaveWithoutSaving).toHaveBeenCalledTimes(1)
  })

  it('does not duplicate an explicit action when the real AlertDialog closes', async () => {
    const user = userEvent.setup()
    const onContinueEditing = jest.fn()
    const onLeaveWithoutSaving = jest.fn()

    render(
      <UnsavedChangesDialogView
        dialogRef={{ current: null }}
        isOpen={true}
        onContinueEditing={onContinueEditing}
        onLeaveWithoutSaving={onLeaveWithoutSaving}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Sair sem salvar' }))

    expect(onLeaveWithoutSaving).toHaveBeenCalledTimes(1)
    expect(onContinueEditing).not.toHaveBeenCalled()
  })

  it('treats Escape/onOpenChange close as continuing to edit', async () => {
    const user = userEvent.setup()
    const onContinueEditing = jest.fn()

    render(
      <UnsavedChangesDialogView
        dialogRef={{ current: null }}
        isOpen={true}
        onContinueEditing={onContinueEditing}
        onLeaveWithoutSaving={jest.fn()}
      />,
    )

    await user.keyboard('{Escape}')

    expect(onContinueEditing).toHaveBeenCalledTimes(1)
  })
})
