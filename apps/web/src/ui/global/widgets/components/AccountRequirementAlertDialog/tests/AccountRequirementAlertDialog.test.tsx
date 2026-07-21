import { fireEvent, render, screen } from '@testing-library/react'

import { ROUTES } from '@/constants'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { AccountRequirementAlertDialog } from '..'

jest.mock('@/ui/global/hooks/useNavigationProvider')
jest.mock('../AccountRequirementAlertDialogView', () => ({
  AccountRequirementAlertDialogView: ({ onConfirm }: { onConfirm: () => void }) => (
    <button onClick={onConfirm}>Fazer login</button>
  ),
}))

describe('AccountRequirementAlertDialog', () => {
  it('should navigate to sign-in with the current route', () => {
    const goTo = jest.fn()
    const currentRoute = '/challenging/challenges/desafio/challenge/executions'
    jest.mocked(useNavigationProvider).mockReturnValue({
      currentRoute,
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
    })

    render(<AccountRequirementAlertDialog description='Acesse a sua conta' />)

    fireEvent.click(screen.getByRole('button', { name: 'Fazer login' }))

    expect(goTo).toHaveBeenCalledWith(
      `${ROUTES.auth.signIn}?nextRoute=${encodeURIComponent(currentRoute)}`,
    )
  })
})
