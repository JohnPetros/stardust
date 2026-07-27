import { render, screen } from '@testing-library/react'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { AccountRequirementAlertDialog } from '..'

jest.mock('@/ui/global/hooks/useNavigationProvider')
jest.mock('../AccountRequirementAlertDialogView', () => ({
  AccountRequirementAlertDialogView: ({ nextRoute }: { nextRoute: string }) => (
    <span data-testid='next-route'>{nextRoute}</span>
  ),
}))

describe('AccountRequirementAlertDialog', () => {
  it('should pass the current route as the sign-in destination', () => {
    const currentRoute = '/challenging/challenges/desafio/challenge/executions'
    jest.mocked(useNavigationProvider).mockReturnValue({
      currentRoute,
      goTo: jest.fn(),
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
    })

    render(<AccountRequirementAlertDialog description='Acesse a sua conta' />)

    expect(screen.getByTestId('next-route')).toHaveTextContent(currentRoute)
  })
})
