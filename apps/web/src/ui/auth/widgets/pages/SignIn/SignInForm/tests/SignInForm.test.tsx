import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SignInForm } from '..'
import { GLOBAL_ERROR_MESSAGES } from '@stardust/validation/global/constants'

describe('SignInForm', () => {
  const onSubmitMock = jest.fn()
  const fakeEmail = 'apollo@gmail.com'
  const fakePassword = 'adsfs42$$PJ'

  const FormFields = () => {
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByTestId('submit-button')

    return { emailInput, passwordInput, submitButton }
  }

  const Widget = () => <SignInForm onSubmit={onSubmitMock} />

  it('should render invalid email error message when email is invalid', async () => {
    render(Widget())

    expect(screen.queryByText(GLOBAL_ERROR_MESSAGES.email.regex)).toBeNull()

    const { submitButton } = FormFields()

    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(GLOBAL_ERROR_MESSAGES.email.regex)).toBeVisible()
    })
  })

  it('should render invalid password error message when password is less than 6 characters', async () => {
    render(Widget())

    const { passwordInput, submitButton } = FormFields()

    expect(screen.queryByText(GLOBAL_ERROR_MESSAGES.password.min)).toBeNull()

    await userEvent.type(passwordInput, '12345')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(GLOBAL_ERROR_MESSAGES.password.min)).toBeVisible()
    })
  })

  it('should call onSubmit when form is valid and submit button is clicked', async () => {
    render(Widget())

    const { emailInput, passwordInput, submitButton } = FormFields()

    await userEvent.type(emailInput, fakeEmail)
    await userEvent.type(passwordInput, fakePassword)
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: fakeEmail,
        password: fakePassword,
      })
    })
  })
})
