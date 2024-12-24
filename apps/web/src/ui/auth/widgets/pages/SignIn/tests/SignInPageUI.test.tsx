import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SignInPage } from '..'
import { useSignInPageMock } from './mocks'
import { ROUTES } from '@/constants'

jest.mock('../useSignInPage')

const UI = () => <SignInPage />

describe('SignIn Page UI', () => {
  beforeAll(() => {
    useSignInPageMock()
  })

  it('should render sign in form only when the rocket animations is not visible', async () => {
    useSignInPageMock({ isRocketVisible: true })

    const { rerender } = render(UI())

    await waitFor(() => {
      const form = screen.queryByRole('form', { name: 'sign-in-form' })
      expect(form).toBeFalsy()
    })

    useSignInPageMock({ isRocketVisible: false })

    rerender(UI())

    await waitFor(() => {
      const form = screen.getByRole('form', { name: 'sign-in-form' })
      expect(form).toBeVisible()
    })
  })

  it('should render a link that goes to the reset password page and another that goes to the sign up page', async () => {
    render(UI())

    await waitFor(() => {
      const resetPasswordPageLink = screen.getByText('Esqueci a senha')
      const SignUpPageLink = screen.getByText('Criar conta')

      expect(resetPasswordPageLink).toHaveAttribute('href', ROUTES.auth.resetPassword)
      expect(SignUpPageLink).toHaveAttribute('href', ROUTES.auth.signUp)
    })
  })

  it('should submit form on click button', async () => {
    const { handleFormSubmitMock } = useSignInPageMock()
    render(UI())

    await waitFor(async () => {
      const button = screen.getByRole('button', { name: 'Entrar' })
      const emailInput = screen.getByPlaceholderText('Digite seu e-mail')
      const passwordInput = screen.getByPlaceholderText('Digite sua senha')

      const fakeEmail = 'apollo@gmail.com'
      const fakePassword = 'aa42PP$$'

      await userEvent.type(emailInput, fakeEmail)
      await userEvent.type(passwordInput, fakePassword)

      act(() => {
        userEvent.click(button)
      })

      expect(handleFormSubmitMock).toHaveBeenCalledWith({
        email: fakeEmail,
        password: fakePassword,
      })
    })
  })
})
