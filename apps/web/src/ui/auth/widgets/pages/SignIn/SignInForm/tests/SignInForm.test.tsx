import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { SignInForm } from '..'

const INVALID_EMAIL_MESSAGE = 'Informe um e-mail válido'
const INVALID_PASSWORD_MESSAGE = 'Sua senha deve conter pelo menos 6 caracteres'

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

  const onResendEmailMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const Widget = (props?: Partial<ComponentProps<typeof SignInForm>>) => (
    <SignInForm
      onSubmit={onSubmitMock}
      unconfirmedEmail={null}
      isResendingEmail={false}
      onResendEmail={onResendEmailMock}
      {...props}
    />
  )

  it('should render invalid email error message when email is invalid', async () => {
    render(Widget())

    expect(screen.getByTestId('email-input')).toHaveValue('')

    expect(screen.queryByText(INVALID_EMAIL_MESSAGE)).toBeNull()

    const { submitButton } = FormFields()

    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(INVALID_EMAIL_MESSAGE)).toBeVisible()
    })
  })

  it('should render invalid password error message when password is less than 6 characters', async () => {
    render(Widget())

    const { passwordInput, submitButton } = FormFields()

    expect(screen.queryByText(INVALID_PASSWORD_MESSAGE)).toBeNull()

    await userEvent.type(passwordInput, '12345')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(INVALID_PASSWORD_MESSAGE)).toBeVisible()
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

  it('should not render the unconfirmed email notice when there is no unconfirmed email', () => {
    render(Widget())

    expect(screen.queryByTestId('unconfirmed-email-notice')).toBeNull()
  })

  it('should render the notice with the email between the password field and the submit button', () => {
    render(Widget({ unconfirmedEmail: fakeEmail }))

    const notice = screen.getByTestId('unconfirmed-email-notice')
    const { passwordInput, submitButton } = FormFields()

    expect(notice).toHaveTextContent(fakeEmail)
    expect(
      passwordInput.compareDocumentPosition(notice) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      notice.compareDocumentPosition(submitButton) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('should call onResendEmail without submitting the form when the resend button is clicked', async () => {
    render(Widget({ unconfirmedEmail: fakeEmail }))

    await userEvent.type(screen.getByTestId('email-input'), fakeEmail)
    await userEvent.type(screen.getByTestId('password-input'), fakePassword)
    await userEvent.click(screen.getByTestId('resend-confirmation-email-button'))

    expect(onResendEmailMock).toHaveBeenCalledTimes(1)
    expect(onSubmitMock).not.toHaveBeenCalled()
  })
})
