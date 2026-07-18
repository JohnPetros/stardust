import { render, screen } from '@testing-library/react'

import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { ChallengeCodeExecutionErrorDialog } from '../ChallengeCodeExecutionErrorDialog'

jest.mock('@/ui/global/widgets/components/Dialog', () => ({
  Container: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  Content: ({ children }: any) => <div>{children}</div>,
  Header: ({ children }: any) => <h2>{children}</h2>,
}))

const createExecution = (line: number | null, isInternal = false) =>
  ChallengeCodeExecution.create({
    code: 'escreva("Olá")',
    status: isInternal ? 'internal_error' : 'runtime_error',
    testResults: [],
    outputs: [],
    error: {
      message: isInternal ? 'Falha interna' : 'Variável não definida',
      line,
      isInternal,
    },
  })

describe('ChallengeCodeExecutionErrorDialog', () => {
  it('should render user error message with line', () => {
    render(
      <ChallengeCodeExecutionErrorDialog
        execution={createExecution(3)}
        onOpenChange={jest.fn()}
      />,
    )

    expect(screen.getByText('Erro da execução')).toBeInTheDocument()
    expect(screen.getByText('Linha:')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Variável não definida')).toBeInTheDocument()
  })

  it('should render internal error without line when line is null', () => {
    render(
      <ChallengeCodeExecutionErrorDialog
        execution={createExecution(null, true)}
        onOpenChange={jest.fn()}
      />,
    )

    expect(screen.getByText('Falha interna')).toBeInTheDocument()
    expect(screen.queryByText('Linha:')).not.toBeInTheDocument()
  })
})
