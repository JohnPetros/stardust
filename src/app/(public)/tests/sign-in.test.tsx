import { ToastProvider } from '@radix-ui/react-toast'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { useRouter } from 'next/navigation'

import SignIn from '../sign-in/page'

import { AuthContext, AuthContextValue } from '@/contexts/AuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'

jest.mock('next/navigation')

function renderPage(hasError: boolean = false) {
  const signInMock = jest
    .fn()
    .mockReturnValueOnce(hasError ? 'Invalid login credentials' : null)

  const useRouterMock = jest.mocked(useRouter)
  const pushMock = jest.fn()

  useRouterMock.mockReturnValueOnce({
    push: pushMock,
  } as unknown as AppRouterInstance)

  render(
    <SupabaseProvider>
      <AuthContext.Provider
        value={{ signIn: signInMock } as unknown as AuthContextValue}
      >
        <ToastProvider>
          <SignIn />
        </ToastProvider>
      </AuthContext.Provider>
    </SupabaseProvider>
  )

  return { signInMock, pushMock }
}

describe('Sign in page', () => {
  it('should render input fields', async () => {
    renderPage()

    const inputEmail = screen.getByPlaceholderText(/digite seu e-mail/i)
    const inputPassword = screen.getByPlaceholderText(/digite sua senha/i)

    await waitFor(() => {
      expect(inputEmail).toBeTruthy()
      expect(inputPassword).toBeTruthy()
    })
  })

  it('should call sign in function on submit', async () => {
    const { signInMock } = renderPage()

    const emailValue = 'joaopedro.cds@gmail.com'
    const passwordValue = 'jonasJP77$'

    const inputEmail = screen.getByPlaceholderText(/digite seu e-mail/i)
    const inputPassword = screen.getByPlaceholderText(/digite sua senha/i)

    fireEvent.change(inputEmail, {
      target: { value: emailValue },
    })

    fireEvent.change(inputPassword, {
      target: { value: passwordValue },
    })

    const button = screen.getByText(/Entrar/i)

    act(() => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith(emailValue, passwordValue)
    })
  })

  it('should show toast on sign in invalid credentials error', async () => {
    const { signInMock } = renderPage(true)

    const emailValue = 'joaopedro.cds@gmail.com'
    const passwordValue = 'jonasJP77$'

    const inputEmail = screen.getByPlaceholderText(/digite seu e-mail/i)
    const inputPassword = screen.getByPlaceholderText(/digite sua senha/i)

    fireEvent.change(inputEmail, {
      target: { value: emailValue },
    })

    fireEvent.change(inputPassword, {
      target: { value: passwordValue },
    })

    const button = screen.getByText(/Entrar/i)

    act(() => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(signInMock).toHaveReturnedWith('Invalid login credentials')
      expect(screen.queryByText(/Usuário não encontrado/i)).toBeTruthy()
    })
  })

  it('should redirect user to home page on successful sign in', async () => {
    const { pushMock } = renderPage(false)

    const emailValue = 'joaopedro.cds@gmail.com'
    const passwordValue = 'jonasJP77$'

    const inputEmail = screen.getByPlaceholderText(/digite seu e-mail/i)
    const inputPassword = screen.getByPlaceholderText(/digite sua senha/i)

    fireEvent.change(inputEmail, {
      target: { value: emailValue },
    })

    fireEvent.change(inputPassword, {
      target: { value: passwordValue },
    })

    const button = screen.getByText(/Entrar/i)

    act(() => {
      fireEvent.click(button)
    })

    await waitFor(
      () => {
        expect(pushMock).toHaveBeenCalledWith('/')
      },
      { timeout: 5000 }
    )
  })
})
