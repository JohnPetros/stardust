import { render, screen, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'
import { SignUpForm } from '..'

import type { ProfileService } from '@stardust/core/profile/interfaces'
import userEvent from '@testing-library/user-event'

describe('SignUpForm', () => {
  const userName = 'fake user name'
  const userEmail = 'fake@email.com'
  const userPassword = '123456'
  let profileService: Mock<ProfileService>
  let onSubmit: jest.Mock

  beforeEach(() => {
    profileService = mock<ProfileService>()
    profileService.verifyUserNameInUse.mockImplementation()
    onSubmit = jest.fn()
  })

  it('should render name error message when name is invalid', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    const nameInput = screen.getByTestId('name-input')

    await userEvent.type(nameInput, '1')

    const nameInputError = screen.queryByTestId('name-input-error')

    expect(nameInputError).toBeVisible()
  })

  it('should render email input only when name input is valid', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    let emailInput = screen.queryByTestId('email-input')
    expect(emailInput).toBeNull()

    const nameInput = screen.getByTestId('name-input')
    await userEvent.type(nameInput, userName)

    emailInput = screen.queryByTestId('email-input')
    expect(emailInput).toBeVisible()
  })

  it('should render password input only when email input is valid', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    let passwordInput = screen.queryByTestId('password-input')
    expect(passwordInput).toBeNull()

    const nameInput = screen.getByTestId('name-input')
    await userEvent.type(nameInput, userName)
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, userEmail)

    passwordInput = screen.queryByTestId('password-input')
    await waitFor(() => {
      expect(passwordInput).toBeVisible()
    })
  })

  it('should render submit button only when password input is valid', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    let submitButton = screen.queryByTestId('submit-button')
    expect(submitButton).toBeNull()

    const nameInput = screen.getByTestId('name-input')
    await userEvent.type(nameInput, userName)
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, userEmail)
    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, userPassword)

    submitButton = screen.queryByTestId('submit-button')
    await waitFor(() => {
      expect(submitButton).toBeVisible()
    })
  })

  it('should call onSubmit when form is submitted with user email, password and name', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    const nameInput = screen.getByTestId('name-input')
    await userEvent.type(nameInput, userName)
    const emailInput = screen.getByTestId('email-input')
    await userEvent.type(emailInput, userEmail)
    const passwordInput = screen.getByTestId('password-input')
    await userEvent.type(passwordInput, userPassword)

    const submitButton = screen.getByTestId('submit-button')

    expect(onSubmit).not.toHaveBeenCalled()

    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith(userEmail, userPassword, userName)
  })
})
