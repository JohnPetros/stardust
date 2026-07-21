import { fireEvent, render, screen } from '@testing-library/react'

import { AccountRequirementAlertDialogView } from '../AccountRequirementAlertDialogView'

jest.mock('../../AlertDialog', () => ({
  AlertDialog: ({ action }: { action: React.ReactNode }) => action,
}))

describe('AccountRequirementAlertDialogView', () => {
  it('should run the sign-in action', () => {
    const onConfirm = jest.fn()

    render(
      <AccountRequirementAlertDialogView
        description='Acesse a sua conta'
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Fazer login' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
