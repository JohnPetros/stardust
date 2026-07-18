import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { ChallengeCodeExecutionCodeDialog } from '../ChallengeCodeExecutionCodeDialog'

jest.mock('@/ui/global/widgets/components/Dialog', () => ({
  Container: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  Content: ({ children }: any) => <div>{children}</div>,
  Header: ({ children }: any) => <h2>{children}</h2>,
}))

jest.mock('@/ui/global/widgets/components/CodeSnippet', () => ({
  CodeSnippet: ({ code }: { code: string }) => <pre>{code}</pre>,
}))

const execution = ChallengeCodeExecution.create({
  code: 'escreva("Olá")',
  status: 'accepted',
  testResults: [{ position: 1, isCorrect: true, userOutput: 1, expectedOutput: 1 }],
  outputs: [],
  error: null,
})

describe('ChallengeCodeExecutionCodeDialog', () => {
  it('should render execution code and call onUseCode with selected execution', async () => {
    const user = userEvent.setup()
    const onUseCode = jest.fn()

    render(
      <ChallengeCodeExecutionCodeDialog
        execution={execution}
        onOpenChange={jest.fn()}
        onUseCode={onUseCode}
      />,
    )

    expect(screen.getByText('Código da execução')).toBeInTheDocument()
    expect(screen.getByText('escreva("Olá")')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Usar no editor' }))

    expect(onUseCode).toHaveBeenCalledWith(execution)
  })

  it('should stay closed without an execution', () => {
    render(
      <ChallengeCodeExecutionCodeDialog
        execution={null}
        onOpenChange={jest.fn()}
        onUseCode={jest.fn()}
      />,
    )

    expect(screen.queryByText('Código da execução')).not.toBeInTheDocument()
  })
})
