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
})
