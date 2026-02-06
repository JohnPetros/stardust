import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import { ROUTES } from '@/constants'
import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { SignInPageView } from '../SignInPageView'

jest.mock('@/ui/auth/widgets/pages/ResetPassword/AnimatedForm', () => ({
  AnimatedForm: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/ui/auth/widgets/pages/SignIn/AnimatedHero', () => ({
  AnimatedHero: () => <div data-testid='animated-hero' />,
}))

jest.mock('@/ui/auth/widgets/components/RocketAnimation', () => ({
  RocketAnimation: () => <div data-testid='rocket-animation' />,
}))

describe('SignInPageView', () => {
  const handleFormSubmit = jest.fn()

  it('should render the reset password and create account links', () => {
    render(
      <SignInPageView
        rocketAnimationRef={animationRefMock}
        isRocketVisible={false}
        handleFormSubmit={handleFormSubmit}
      />,
    )

    const resetPasswordLink = screen.getByTestId('reset-password-link')
    const createAccountLink = screen.getByTestId('create-account-link')

    expect(resetPasswordLink).toHaveAttribute('href', ROUTES.auth.resetPassword)
    expect(createAccountLink).toHaveAttribute('href', ROUTES.auth.signUp)
  })
})
