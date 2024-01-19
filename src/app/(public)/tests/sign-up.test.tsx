import { ToastProvider } from '@radix-ui/react-toast'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { useRouter } from 'next/navigation'

import SignUp from '../sign-up/page'

import { usersMock } from '@/__tests__/mocks/usersMock'
import { SignUpError } from '@/@types/signupError'
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { useApi } from '@/services/api'
import { SIGN_UP_ERRORS } from '@/utils/constants/errors'

jest.mock('next/navigation')
jest.mock('../../../services/api')

const userMock = usersMock[0]

function signUpUserMock() {
  const nameValue = 'John Petros'
  const emailValue = 'joao.cds@gmail.com'
  const passwordValue = 'jonasJP77$'
  const passwordConfirmationValue = 'jonasJP77$'

  const inputEmail = screen.getByPlaceholderText(/digite seu e-mail/i)
  const inputPassword = screen.getByPlaceholderText(/digite sua senha/i)
  const inputName = screen.getByPlaceholderText(/digite seu nome de usuário/i)
  const inputPasswordConfirmation =
    screen.getByPlaceholderText(/confirme sua senha/i)

  fireEvent.change(inputName, {
    target: { value: nameValue },
  })

  fireEvent.change(inputEmail, {
    target: { value: emailValue },
  })

  fireEvent.change(inputPassword, {
    target: { value: passwordValue },
  })

  fireEvent.change(inputPasswordConfirmation, {
    target: { value: passwordConfirmationValue },
  })

  const button = screen.getByText(/Entrar/i)

  fireEvent.click(button)

  return {
    email: emailValue,
    name: nameValue,
    password: passwordValue,
    passwordConfirmation: passwordConfirmationValue,
  }
}

function useApiMock(hasUser: boolean = false) {
  const useApiMock = jest.mocked(useApi)
  const addUserMock = jest.fn()
  const getUserByEmailMock = jest
    .fn()
    .mockReturnValueOnce(hasUser ? 'user mock' : null)

  const apiMock = {
    addUser: addUserMock,
    getUserByEmail: getUserByEmailMock,
  }

  useApiMock.mockReturnValueOnce(apiMock as keyof typeof useApi)

  return apiMock
}

function renderPage(error: string = '') {
  const signUpMock = jest
    .fn()
    .mockReturnValueOnce(
      error.length > 0
        ? { userId: null, error: { message: error } }
        : { userId: userMock.id, error: null }
    )

  const useRouterMock = jest.mocked(useRouter)
  const pushMock = jest.fn()

  useRouterMock.mockReturnValueOnce({
    push: pushMock,
  } as unknown as AppRouterInstance)

  render(
    <SupabaseProvider>
      <AuthContext.Provider
        value={{ signUp: signUpMock } as unknown as AuthContextValue}
      >
        <ToastProvider>
          <SignUp />
        </ToastProvider>
      </AuthContext.Provider>
    </SupabaseProvider>
  )

  return { signUpMock, pushMock }
}

describe('Sign up page', () => {
  it('should render input fields', async () => {
    renderPage()

    const inputEmail = screen.getByPlaceholderText(/digite seu e-mail/i)
    const inputPassword = screen.getByPlaceholderText(/digite sua senha/i)
    const inputName = screen.getByPlaceholderText(/digite seu nome de usuário/i)
    const inputPasswordConfirmation =
      screen.getByPlaceholderText(/confirme sua senha/i)

    await waitFor(() => {
      expect(inputEmail).toBeTruthy()
    })

    await waitFor(() => {
      expect(inputPassword).toBeTruthy()
    })

    await waitFor(() => {
      expect(inputName).toBeTruthy()
    })

    await waitFor(() => {
      expect(inputPasswordConfirmation).toBeTruthy()
    })
  })

  it('should call sign up function on submit', async () => {
    useApiMock(false)

    const { signUpMock } = renderPage()

    const { email, password } = signUpUserMock()

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith(email, password)
    })
  })

  it('should show error toast on sign up already used email', async () => {
    const apiMock = useApiMock(true)

    renderPage()

    const { email } = signUpUserMock()

    await waitFor(() => {
      expect(apiMock.getUserByEmail).toHaveBeenCalledWith(email)
    })

    await waitFor(() => {
      expect(
        screen.getByText(/Usuário já registrado com esse e-mail/i)
      ).toBeVisible()
    })
  })

  it('should show toast on succesful sign up', async () => {
    useApiMock(false)

    renderPage()

    signUpUserMock()

    await waitFor(() => {
      expect(
        screen.getByText(/Confira seu e-mail para confirmar seu cadastro/i)
      ).toBeVisible()
    })
  })

  it.each(Object.keys(SIGN_UP_ERRORS))(
    'should handle sign up error',
    async (error) => {
      useApiMock()

      renderPage(error)

      signUpUserMock()

      await waitFor(() => {
        expect(
          screen.getByText(SIGN_UP_ERRORS[error as SignUpError])
        ).toBeVisible()
      })
    }
  )

  it('should add a new user on successful sign up', async () => {
    const apiMock = useApiMock(false)

    renderPage()

    const { email, name } = signUpUserMock()

    await waitFor(() => {
      expect(apiMock.addUser).toHaveBeenCalledWith({
        id: userMock.id,
        email,
        name,
      })
    })
  })
})
