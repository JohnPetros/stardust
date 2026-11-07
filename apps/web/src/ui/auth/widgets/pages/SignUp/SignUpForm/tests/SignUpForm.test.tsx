import { render, screen, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'
import { SignUpForm } from '..'

import { RestResponse } from '@stardust/core/global/responses'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import userEvent from '@testing-library/user-event'

describe('SignUpForm', () => {
  const userName = 'fake user name'
  const userEmail = 'fake@email.com'
  const userPassword = '123456'
  let profileService: Mock<ProfileService>
  const resolveAfterLatency = (response: RestResponse) =>
    new Promise<RestResponse>((resolve) => setTimeout(() => resolve(response), 50))
  let onSubmit: jest.Mock

  beforeEach(() => {
    profileService = mock<ProfileService>()
    profileService.verifyUserNameInUse.mockImplementation()
    profileService.verifyUserEmailInUse.mockImplementation()
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

    const nameInputError = await screen.findByTestId('name-input-error')

    expect(nameInputError).toBeVisible()
  })

  it('should not render the schema validation message in the name error slot', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    await userEvent.type(screen.getByTestId('name-input'), '1')

    await waitFor(() => expect(screen.getByTestId('name-input-error')).toBeVisible())
    expect(screen.getByTestId('name-input-error')).toHaveTextContent(
      'Pelo menos 3 caracteres',
    )
    expect(screen.queryByText('Nome deve conter pelo menos 3 caracteres')).toBeNull()
  })

  it('should not render the schema validation message in the email error slot', async () => {
    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    await userEvent.type(screen.getByTestId('name-input'), userName)
    const emailInput = await screen.findByTestId('email-input')
    await userEvent.type(emailInput, 'abc')

    await waitFor(() => expect(screen.getByTestId('email-input-error')).toBeVisible())
    expect(screen.getByTestId('email-input-error')).toHaveTextContent(
      'E-mail válido, por favor',
    )
    expect(screen.queryByText('Informe um e-mail válido')).toBeNull()
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

    emailInput = await screen.findByTestId('email-input')
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
    const emailInput = await screen.findByTestId('email-input')
    await userEvent.type(emailInput, userEmail)

    passwordInput = await screen.findByTestId('password-input')
    expect(passwordInput).toBeInTheDocument()
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
    const emailInput = await screen.findByTestId('email-input')
    await userEvent.type(emailInput, userEmail)
    const passwordInput = await screen.findByTestId('password-input')
    await userEvent.type(passwordInput, userPassword)

    submitButton = await screen.findByTestId('submit-button')
    expect(submitButton).toBeInTheDocument()
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
    const emailInput = await screen.findByTestId('email-input')
    await userEvent.type(emailInput, userEmail)
    const passwordInput = await screen.findByTestId('password-input')
    await userEvent.type(passwordInput, userPassword)

    const submitButton = screen.getByTestId('submit-button')

    expect(onSubmit).not.toHaveBeenCalled()

    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith(userEmail, userPassword, userName)
  })

  it('should render the name already in use error message when the name is taken', async () => {
    profileService.verifyUserNameInUse.mockImplementation(() =>
      resolveAfterLatency(
        new RestResponse({ statusCode: 409, errorMessage: 'Nome em uso' }),
      ),
    )

    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    const nameInput = screen.getByTestId('name-input')
    await userEvent.type(nameInput, userName)

    await waitFor(() =>
      expect(screen.getByText('Nome já utilizado por outro usuário')).toBeVisible(),
    )
  })

  it('should render the email already in use error message when the email is taken', async () => {
    profileService.verifyUserEmailInUse.mockImplementation(() =>
      resolveAfterLatency(
        new RestResponse({ statusCode: 409, errorMessage: 'E-mail em uso' }),
      ),
    )

    render(
      <SignUpForm
        isSubmitting={false}
        profileService={profileService}
        onSubmit={onSubmit}
      />,
    )

    const nameInput = screen.getByTestId('name-input')
    await userEvent.type(nameInput, userName)
    const emailInput = await screen.findByTestId('email-input')
    await userEvent.type(emailInput, userEmail)

    await waitFor(() =>
      expect(screen.getByText('E-mail já utilizado por outro usuário')).toBeVisible(),
    )
  })
})
