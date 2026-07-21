import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { ChallengeCodeExecutionItem } from '../ChallengeCodeExecutionItem'

const createExecution = (
  overrides: Partial<Parameters<typeof ChallengeCodeExecution.create>[0]> = {},
) =>
  ChallengeCodeExecution.create({
    code: 'escreva("Olá")',
    status: 'wrong_answer',
    testResults: [
      { position: 1, isCorrect: true, userOutput: 1, expectedOutput: 1 },
      { position: 2, isCorrect: false, userOutput: 1, expectedOutput: 2 },
    ],
    outputs: [],
    error: null,
    createdAt: '2026-07-17T03:19:31.000Z',
    ...overrides,
  })

describe('ChallengeCodeExecutionItem', () => {
  it('should show execution status and test progress', () => {
    render(
      <ChallengeCodeExecutionItem
        execution={createExecution()}
        onShowCode={jest.fn()}
        onShowError={jest.fn()}
      />,
    )

    expect(screen.getByText('Resposta incorreta')).toBeInTheDocument()
    expect(screen.getByText('Testes aprovados')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Testes aprovados' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    )
    expect(screen.getByRole('progressbar', { name: 'Testes aprovados' })).toHaveAttribute(
      'aria-valuemax',
      '2',
    )
  })

  it('should open the execution code', async () => {
    const user = userEvent.setup()
    const execution = createExecution()
    const onShowCode = jest.fn()

    render(
      <ChallengeCodeExecutionItem
        execution={execution}
        onShowCode={onShowCode}
        onShowError={jest.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Ver código' }))

    expect(onShowCode).toHaveBeenCalledWith(execution)
  })

  it('should identify an execution interrupted before the tests', () => {
    render(
      <ChallengeCodeExecutionItem
        execution={createExecution({ status: 'syntax_error', testResults: [] })}
        onShowCode={jest.fn()}
        onShowError={jest.fn()}
      />,
    )

    expect(screen.getByText('Nenhum teste concluído')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('should show the error action only for executions with an error', async () => {
    const user = userEvent.setup()
    const execution = createExecution({
      status: 'runtime_error',
      error: { message: 'Falha ao executar', line: 2, isInternal: false },
    })
    const onShowError = jest.fn()

    const { rerender } = render(
      <ChallengeCodeExecutionItem
        execution={execution}
        onShowCode={jest.fn()}
        onShowError={onShowError}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Ver erro' }))
    expect(onShowError).toHaveBeenCalledWith(execution)

    rerender(
      <ChallengeCodeExecutionItem
        execution={createExecution()}
        onShowCode={jest.fn()}
        onShowError={onShowError}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Ver erro' })).not.toBeInTheDocument()
  })
})
