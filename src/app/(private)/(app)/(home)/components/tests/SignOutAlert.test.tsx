import { ToastProvider } from '@radix-ui/react-toast'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SignOutAlert } from '../SignOutAlertDialog'

import { userMock } from '@/__tests__/mocks/core/usersMock'
import {
  AuthContext,
  AuthContextValue,
} from '@/contexts/AuthContext/hooks/useAuthContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'

function renderAlert() {
  const signOutMock = jest.fn()

  render(
    <SupabaseProvider>
      <TooltipProvider>
        <ToastProvider>
          <AuthContext.Provider
            value={
              {
                user: userMock,
                signOut: signOutMock,
              } as unknown as AuthContextValue
            }
          >
            <SignOutAlert>
              <button>trigger</button>
            </SignOutAlert>
          </AuthContext.Provider>
        </ToastProvider>
      </TooltipProvider>
    </SupabaseProvider>
  )

  return { signOutMock }
}

describe('SignOutAlert component', () => {
  it('should render correctly', async () => {
    renderAlert()

    const trigger = screen.getByText('trigger')

    await userEvent.click(trigger)

    expect(screen.getByRole('alertdialog')).toBeVisible()
  })

  it('should sign out user on confirm', async () => {
    const { signOutMock } = renderAlert()

    const trigger = screen.getByText('trigger')
    await userEvent.click(trigger)

    const confirmButton = screen.getByText('Sair')
    await userEvent.click(confirmButton)

    expect(signOutMock).toHaveBeenCalled()
  })

  it('should close alert on cancel', async () => {
    renderAlert()

    const trigger = screen.getByText('trigger')
    await userEvent.click(trigger)

    const confirmButton = screen.getByText('Cancelar')
    await userEvent.click(confirmButton)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
