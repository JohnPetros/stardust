import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import { ROUTES } from '@/constants'
import { ResetPasswordPageView } from '../ResetPasswordPageView'

jest.mock('@/ui/auth/widgets/pages/ResetPassword/AnimatedForm', () => ({
  AnimatedForm: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/ui/auth/widgets/pages/ResetPassword/ResetPasswordFormDialog', () => ({
  ResetPasswordFormDialog: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('ResetPasswordPageView', () => {
  function View(params?: { canResetPassword?: boolean }) {
    render(
      <ResetPasswordPageView
        canResetPassword={params?.canResetPassword ?? false}
        isLoading={false}
        email=''
        errorMessage=''
        onEmailChange={jest.fn()}
        onEmailSubmit={jest.fn()}
        onNewPasswordSubmit={jest.fn()}
        onPasswordReset={jest.fn()}
      />,
    )
  }

  it('should render reset password request form selectors and sign in link', () => {
    View()

    expect(screen.getByTestId('reset-password-request-form')).toBeVisible()
    expect(screen.getByTestId('email-input')).toBeVisible()
    expect(screen.getByTestId('submit-button')).toBeVisible()
    expect(screen.getByTestId('sign-in-link')).toHaveAttribute('href', ROUTES.auth.signIn)
  })

  it('should render the request form with the subtle sign in link inside the 384px content container', () => {
    View()

    expect(screen.getByRole('heading', { name: 'Redefina sua senha' })).toBeVisible()
    expect(screen.getByTestId('sign-in-link')).toHaveClass('text-theme-text-secondary')
    const contentContainer = screen
      .getByTestId('reset-password-request-form')
      .closest('.max-w-\\[384px\\]')

    expect(contentContainer).not.toBeNull()
    expect(contentContainer).toHaveClass('w-full', 'max-w-[384px]')
    expect(contentContainer).toContainElement(screen.getByTestId('email-input'))
    expect(contentContainer?.querySelector('.w-\\[100rem\\]')).toBeNull()
  })

  it('should render the reset message and the dialog trigger when canResetPassword is true', () => {
    View({ canResetPassword: true })

    expect(
      screen.getByRole('heading', { name: 'Você já pode redefinir sua senha 🚀!' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('open-reset-password-dialog-button')).toBeInTheDocument()
    expect(screen.queryByTestId('reset-password-request-form')).toBeNull()
  })
})
