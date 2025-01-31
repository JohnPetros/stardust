import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SignInForm } from '..'
import { ERROR_MESSAGES } from '@stardust/validation/global/constants'

const onSubmitMock = jest.fn()
const fakeId = 'fake form id'
const fakeEmail = 'apollo@gmail.com'
const fakePassword = 'adsfs42$$PJ'

const UI = () => <SignInForm id={fakeId} onSubmit={onSubmitMock} />

const FormFields = () => {
  const emailInput = screen.getByPlaceholderText('Digite seu e-mail')
  const passwordInput = screen.getByPlaceholderText('Digite sua senha')
  const submitButton = screen.getByText('Entrar')

  return { emailInput, passwordInput, submitButton }
}

describe('SignInForm Component', () => {
  it('should render form with id', () => {
    render(UI())

    const form = screen.getByRole('form', { name: fakeId })

    expect(form).toBeVisible()
  })

  it('should render empty fields error messages', async () => {
    render(UI())

    const { emailInput, passwordInput, submitButton } = FormFields()

    userEvent.type(emailInput, ' ')
    userEvent.type(passwordInput, ' ')

    const errorMessages = screen.queryAllByText(ERROR_MESSAGES.nonempty)
    expect(errorMessages).toHaveLength(0)

    act(() => {
      userEvent.click(submitButton)
    })

    await waitFor(() => {
      const errorMessages = screen.getAllByText(ERROR_MESSAGES.nonempty)
      expect(errorMessages).toHaveLength(2)
    })
  })

  it('should render invalid email error message', async () => {
    render(UI())

    const { emailInput, submitButton } = FormFields()

    const invalidEmail = 'invalid email'

    userEvent.type(emailInput, invalidEmail)

    const errorMessage = screen.queryByText(ERROR_MESSAGES.email.regex)
    expect(errorMessage).not.toBeInTheDocument()

    act(() => {
      userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(emailInput).toHaveValue(invalidEmail)
      const errorMessage = screen.getByText(ERROR_MESSAGES.email.regex)
      expect(errorMessage).toBeVisible()
    })
  })

  it('should render invalid password error message', async () => {
    render(UI())

    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    const submitButton = screen.getByText('Entrar')

    const invalidPassword = 'aaaa42'
    await userEvent.type(passwordInput, invalidPassword)

    const errorMessage = screen.queryByText(ERROR_MESSAGES.password.regex)
    expect(errorMessage).not.toBeInTheDocument()

    act(() => {
      userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(passwordInput).toHaveValue(invalidPassword)
      const errorMessage = screen.getByText(ERROR_MESSAGES.password.regex)
      expect(errorMessage).toBeVisible()
    })
  })

  it('should submit form without errors', async () => {
    render(UI())

    const { emailInput, passwordInput, submitButton } = FormFields()

    await userEvent.type(emailInput, fakeEmail)
    await userEvent.type(passwordInput, fakePassword)

    const errorMessage = screen.queryByText(ERROR_MESSAGES.password.regex)
    expect(errorMessage).not.toBeInTheDocument()

    act(() => {
      userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.queryAllByText(ERROR_MESSAGES.nonempty)).toHaveLength(0)
      expect(screen.queryByText(ERROR_MESSAGES.email.regex)).not.toBeInTheDocument()
      expect(screen.queryByText(ERROR_MESSAGES.password.regex)).not.toBeInTheDocument()
    })
  })

  it('should handle submit form', async () => {
    render(UI())

    const { emailInput, passwordInput, submitButton } = FormFields()

    await userEvent.type(emailInput, fakeEmail)
    await userEvent.type(passwordInput, fakePassword)

    act(() => {
      userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: fakeEmail,
        password: fakePassword,
      })
    })
  })
})
