import { render, screen, waitFor } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'

import type { ProfileService } from '@stardust/core/profile/interfaces'

import { SignUpPageView } from '../SignUpPageView'
import { ROUTES } from '@/constants/routes'

describe('SignUpPageView', () => {
  let profileService: Mock<ProfileService>
  let isSignUpSuccessfull: boolean
  let isResendingEmail: boolean
  let isSubmitting: boolean
  let onFormSubmit: jest.Mock
  let onResendEmail: jest.Mock

  beforeEach(() => {
    profileService = mock<ProfileService>()
    isSignUpSuccessfull = false
    isResendingEmail = false
    isSubmitting = false
    onFormSubmit = jest.fn()
    onResendEmail = jest.fn()
  })

  const View = () => (
    <SignUpPageView
      isSignUpSuccessfull={isSignUpSuccessfull}
      isResendingEmail={isResendingEmail}
      isSubmitting={isSubmitting}
      profileService={profileService}
      onFormSubmit={onFormSubmit}
      onResendEmail={onResendEmail}
    />
  )

  it('should render sign in page link', () => {
    render(View())

    const link = screen.getByTestId('sign-in-link')

    expect(link).toHaveAttribute('href', ROUTES.auth.signIn)
  })

  it('should render sign up form and not render success message if isSignUpSuccessfull is false', async () => {
    isSignUpSuccessfull = false

    render(View())

    const form = screen.getByTestId('sign-up-form')
    const successMessage = screen.queryByTestId('sign-up-success-message')

    await waitFor(
      () => {
        expect(form).toBeVisible()
        expect(successMessage).toBeNull()
      },
      { timeout: 2500 },
    )
  })

  it('should render success message if isSignUpSuccessfull is true', async () => {
    isSignUpSuccessfull = true

    render(View())

    const form = screen.queryByTestId('sign-up-form')
    const successMessage = screen.getByTestId('sign-up-success-message')

    await waitFor(
      () => {
        expect(form).toBeNull()
        expect(successMessage).toBeVisible()
      },
      { timeout: 2500 },
    )
  })

  it('should disable ', async () => {
    isSignUpSuccessfull = true

    render(View())

    const form = screen.queryByTestId('sign-up-form')
    const successMessage = screen.getByTestId('sign-up-success-message')

    await waitFor(
      () => {
        expect(form).toBeNull()
        expect(successMessage).toBeVisible()
      },
      { timeout: 2500 },
    )
  })
})
