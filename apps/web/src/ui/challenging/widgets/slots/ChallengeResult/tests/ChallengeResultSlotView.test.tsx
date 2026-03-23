import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { List, UserAnswer } from '@stardust/core/global/structures'

import { ChallengeResultSlotView } from '../ChallengeResultSlotView'

jest.mock('../TestCase', () => ({
  TestCase: jest.fn(() => <div data-testid='test-case' />),
}))

jest.mock('@/ui/global/widgets/components/AccountRequirementAlertDialog', () => ({
  AccountRequirementAlertDialog: jest.fn(() => (
    <div data-testid='account-requirement-dialog' />
  )),
}))

jest.mock('@/ui/global/widgets/components/VerificationButton', () => ({
  VerificationButton: jest.fn(
    ({ onClick, isLoading, isAnswered, isAnswerVerified, isAnswerCorrect }) => (
      <button
        type='button'
        data-testid='verification-button'
        data-loading={String(isLoading)}
        data-answered={String(isAnswered)}
        data-verified={String(isAnswerVerified)}
        data-correct={String(isAnswerCorrect)}
        onClick={onClick}
      />
    ),
  ),
}))

const { TestCase } = jest.requireMock('../TestCase') as {
  TestCase: jest.Mock
}

describe('ChallengeResultSlotView', () => {
  type Props = ComponentProps<typeof ChallengeResultSlotView>

  const handleUserAnswer = jest.fn()
  const alertDialogRef = { current: null }
  let challenge = ChallengesFaker.fake({
    results: [true, false, true],
    userOutputs: ['1', '2', '3'],
  })

  const syncChallengeState = () => {
    challenge['props'].results = List.create([true, false, true])
    challenge['props'].userOutputs = List.create(['1', '2', '3'])
  }

  const View = (props?: Partial<Props>) => {
    render(
      <ChallengeResultSlotView
        challenge={challenge}
        results={[true, false, true]}
        userAnswer={UserAnswer.create('answer')}
        isLeavingPage={false}
        alertDialogRef={alertDialogRef}
        handleUserAnswer={handleUserAnswer}
        {...props}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    challenge = ChallengesFaker.fake({
      results: [true, false, true],
      userOutputs: ['1', '2', '3'],
    })
    syncChallengeState()
  })

  it('should render one test case per challenge item with the mapped props', () => {
    View()

    expect(screen.getAllByTestId('test-case')).toHaveLength(challenge.testCases.length)
    expect(TestCase).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        position: challenge.testCases[0].position.value,
        isLocked: challenge.testCases[0].isLocked.isTrue,
        isCorrect: true,
        inputs: challenge.testCases[0].inputs,
        userOutput: challenge.userOutputs.getByIndex(0, null),
        expectedOutput: challenge.testCases[0].expectedOutput,
      }),
      undefined,
    )
    expect(TestCase).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        isCorrect: false,
        userOutput: challenge.userOutputs.getByIndex(1, null),
      }),
      undefined,
    )
  })

  it('should pass the verification state to the button', () => {
    const userAnswer = UserAnswer.create('answer').becomeVerified().becomeCorrect()

    View({ userAnswer, isLeavingPage: true })

    expect(screen.getByTestId('verification-button')).toHaveAttribute(
      'data-loading',
      'true',
    )
    expect(screen.getByTestId('verification-button')).toHaveAttribute(
      'data-answered',
      'true',
    )
    expect(screen.getByTestId('verification-button')).toHaveAttribute(
      'data-verified',
      'true',
    )
    expect(screen.getByTestId('verification-button')).toHaveAttribute(
      'data-correct',
      'true',
    )
  })

  it('should call handleUserAnswer when the verification button is clicked', async () => {
    const user = userEvent.setup()

    View()

    await user.click(screen.getByTestId('verification-button'))

    expect(handleUserAnswer).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('account-requirement-dialog')).toBeInTheDocument()
  })
})
