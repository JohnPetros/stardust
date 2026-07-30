import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { ChallengeStore } from '..'
import { INITIAL_CHALLENGE_STORE_STATE } from '../constants'
import { useZustandChallengeStore } from '../../zustand/useZustandChallengeStore'

describe('ChallengeStore code execution', () => {
  afterEach(() => {
    ChallengeStore.setState(INITIAL_CHALLENGE_STORE_STATE)
  })

  it('synchronizes the current code when an execution finishes', () => {
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("resultado")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })

    ChallengeStore.setState({
      ...INITIAL_CHALLENGE_STORE_STATE,
      currentCode: 'código anterior',
      isCodeRunning: true,
      pendingExecutionCode: execution.code.value,
    })

    useZustandChallengeStore.getState().actions.finishCodeExecution(execution)

    expect(ChallengeStore.getState().currentCode).toBe(execution.code.value)
    expect(ChallengeStore.getState().acceptedCodeExecution).toBe(execution)
  })
})
