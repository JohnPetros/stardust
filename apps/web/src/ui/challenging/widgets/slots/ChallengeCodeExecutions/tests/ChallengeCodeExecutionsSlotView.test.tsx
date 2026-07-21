import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { ROUTES } from '@/constants'

import { ChallengeCodeExecutionsSlotView } from '../ChallengeCodeExecutionsSlotView'

jest.mock('../../../components/ChallengeContentNav', () => ({
  ChallengeContentNav: () => <nav data-testid='challenge-content-nav' />,
}))

jest.mock('../ChallengeCodeExecutionCodeDialog', () => ({
  ChallengeCodeExecutionCodeDialog: () => null,
}))

jest.mock('../ChallengeCodeExecutionErrorDialog', () => ({
  ChallengeCodeExecutionErrorDialog: () => null,
}))

jest.mock('@/ui/global/widgets/components/Pagination', () => ({
  Pagination: ({ onPageChange }: any) => (
    <button type='button' onClick={() => onPageChange(2)}>
      Próxima página
    </button>
  ),
}))

describe('ChallengeCodeExecutionsSlotView', () => {
  const nextRoute =
    '/challenging/challenges/veredito-do-painel-estelar/challenge/executions'

  const View = (
    props?: Partial<ComponentProps<typeof ChallengeCodeExecutionsSlotView>>,
  ) =>
    render(
      <ChallengeCodeExecutionsSlotView
        executions={[]}
        selectedCodeExecution={null}
        selectedErrorExecution={null}
        page={1}
        itemsPerPage={20}
        totalItemsCount={0}
        isLoading={false}
        isFailure={false}
        isAccountAuthenticated={false}
        nextRoute={nextRoute}
        onRetry={jest.fn()}
        onPageChange={jest.fn()}
        onSelectCodeExecution={jest.fn()}
        onSelectErrorExecution={jest.fn()}
        onUseExecutionCode={jest.fn()}
        {...props}
      />,
    )

  it('should show a sign-in CTA with the executions route as next route', () => {
    View({ isFailure: true })

    expect(screen.getByText('Entre para continuar')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fazer login' })).toHaveAttribute(
      'href',
      `${ROUTES.auth.signIn}?nextRoute=${encodeURIComponent(nextRoute)}`,
    )
    expect(
      screen.queryByText('Não foi possível carregar suas execuções.'),
    ).not.toBeInTheDocument()
  })

  it('should show loading state for authenticated account', () => {
    View({ isAccountAuthenticated: true, isLoading: true })

    expect(screen.getByText('Execuções')).toBeInTheDocument()
    expect(screen.getByTestId('challenge-content-nav')).toBeInTheDocument()
  })

  it('should call retry on failure', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()

    View({ isAccountAuthenticated: true, isFailure: true, onRetry })

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should show empty state when there are no executions', () => {
    View({ isAccountAuthenticated: true })

    expect(screen.getByText('Nenhuma execução encontrada.')).toBeInTheDocument()
  })

  it('should render executions and page controls', async () => {
    const user = userEvent.setup()
    const onPageChange = jest.fn()
    const onSelectCodeExecution = jest.fn()
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("Olá")',
      status: 'accepted',
      testResults: [{ position: 1, isCorrect: true, userOutput: 1, expectedOutput: 1 }],
      outputs: [],
      error: null,
      createdAt: '2026-07-17T03:19:31.000Z',
    })

    View({
      isAccountAuthenticated: true,
      executions: [execution],
      totalItemsCount: 1,
      onPageChange,
      onSelectCodeExecution,
    })

    expect(screen.getByText('1 execução')).toBeInTheDocument()
    expect(screen.getByText('Aceita')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ver código' }))
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))

    expect(onSelectCodeExecution).toHaveBeenCalledWith(execution)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
