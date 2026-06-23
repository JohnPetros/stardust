import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RestResponse } from '@stardust/core/global/responses'

import { ResetPasswordFormDialog } from '..'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

jest.mock('@/ui/global/hooks/useRestContext', () => ({
  useRestContext: jest.fn(),
}))

jest.mock('@/ui/global/widgets/components/AlertDialog', () => ({
  AlertDialog: () => null,
}))

jest.mock('@/ui/global/contexts/ToastContext', () => ({
  useToastContext: () => ({
    showError: jest.fn(),
    showSuccess: jest.fn(),
    show: jest.fn(),
  }),
}))

jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: () => ({
    goTo: jest.fn(),
  }),
}))

describe('ResetPasswordFormDialog', () => {
  const resetPassword = jest.fn()
  const signOut = jest.fn()

  beforeEach(() => {
    jest.mocked(useRestContext).mockReturnValue({
      authService: {
        resetPassword,
        signOut,
      },
    } as never)
    resetPassword.mockResolvedValue(new RestResponse())
    signOut.mockResolvedValue(new RestResponse())
  })

  async function Widget() {
    const user = userEvent.setup()

    render(
      <ResetPasswordFormDialog
        onNewPasswordSubmit={jest.fn()}
        onPasswordReset={jest.fn()}
      >
        <button type='button'>Redefinir senha</button>
      </ResetPasswordFormDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Redefinir senha' }))
  }

  it('should expose stable selectors when new password dialog opens', async () => {
    await Widget()

    expect(screen.getByRole('heading', { name: 'Insira sua nova senha' })).toBeInTheDocument()
    expect(screen.getByTestId('new-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('new-password-confirmation-input')).toBeInTheDocument()
    expect(screen.getByTestId('reset-password-submit-button')).toBeInTheDocument()
  })
})
