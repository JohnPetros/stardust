import { render, screen } from '@testing-library/react'

import { AccountRequirementAlertDialogView } from '../AccountRequirementAlertDialogView'

jest.mock('../../AlertDialog', () => ({
  AlertDialog: ({ action }: { action: React.ReactNode }) => <div>{action}</div>,
}))

describe('AccountRequirementAlertDialogView', () => {
  it('should render a sign-in link with the current route', () => {
    render(
      <AccountRequirementAlertDialogView
        description='Acesse a sua conta'
        nextRoute='/challenging/challenges/desafio/challenge/executions'
      />,
    )

    expect(screen.getByRole('link', { name: 'Fazer login' })).toHaveAttribute(
      'href',
      '/auth/sign-in?nextRoute=%2Fchallenging%2Fchallenges%2Fdesafio%2Fchallenge%2Fexecutions',
    )
  })
})
