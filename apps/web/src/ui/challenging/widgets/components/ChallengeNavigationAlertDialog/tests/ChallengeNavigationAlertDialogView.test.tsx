import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { forwardRef, useImperativeHandle } from 'react'
import type { ComponentProps, RefObject } from 'react'

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
    { title, body, action, cancel, shouldPlayAudio }: any,
    ref,
  ) {
    useImperativeHandle(ref, () => ({ open, close }), [])

    return (
      <div data-testid='alert-dialog' data-should-play-audio={String(shouldPlayAudio)}>
        <h1>{title}</h1>
        <div>{body}</div>
        <div>{action}</div>
        <div>{cancel}</div>
      </div>
    )
  }),
}))

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

import { ChallengeNavigationAlertDialogView } from '../ChallengeNavigationAlertDialogView'

describe('ChallengeNavigationAlertDialogView', () => {
  type Props = ComponentProps<typeof ChallengeNavigationAlertDialogView>

  const View = (props?: Partial<Props>) => {
    const dialogRef = { current: null } as RefObject<AlertDialogRef | null>

    render(
      <ChallengeNavigationAlertDialogView
        dialogRef={dialogRef}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        {...props}
      />,
    )

    return { dialogRef }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the unsaved changes message and disable dialog audio', () => {
    View()

    expect(screen.getByText('Voce tem alteracoes nao salvas')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Deseja descartar o codigo atual para navegar para outro desafio?',
      ),
    ).toBeInTheDocument()
    expect(screen.getByTestId('alert-dialog')).toHaveAttribute(
      'data-should-play-audio',
      'false',
    )
  })

  it('should wire the dialog ref and action callbacks', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    const onCancel = jest.fn()
    const { dialogRef } = View({ onConfirm, onCancel })

    expect(dialogRef.current).toEqual({ open, close })

    await user.click(screen.getByRole('button', { name: 'Descartar e navegar' }))
    await user.click(screen.getByRole('button', { name: 'Permanecer' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
