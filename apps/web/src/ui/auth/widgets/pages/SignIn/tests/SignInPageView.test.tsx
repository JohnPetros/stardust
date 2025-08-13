import { render, screen } from '@testing-library/react'
import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { SignInPageView } from '../SignInPageView'
import { ROUTES } from '@/constants'

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
