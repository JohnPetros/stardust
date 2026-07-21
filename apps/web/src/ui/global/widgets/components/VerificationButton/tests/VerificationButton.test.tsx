import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { VerificationButton } from '../index'

jest.mock('next/navigation', () => ({
  usePathname: () => '/challenging/challenges/desafio/challenge/result',
}))

jest.mock('@/ui/global/hooks/useAudioContext', () => ({
  useAudioContext: () => ({ playAudio: jest.fn() }),
}))

jest.mock('@/ui/global/hooks/useEventListener', () => ({
  useEventListener: jest.fn(),
}))

jest.mock('../AnimatedPanel', () => ({
  AnimatedPanel: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('../StyledButton', () => ({
  StyledButton: ({ children, disabled, onClick }: any) => (
    <button type='button' disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}))

describe('VerificationButton', () => {
  it('should keep default behavior when it is answered and not blocked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(
      <VerificationButton
        isAnswered={true}
        isAnswerVerified={false}
        isAnswerCorrect={false}
        onClick={onClick}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Verificar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should block click and show reason when blocked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(
      <VerificationButton
        isAnswered={true}
        isAnswerVerified={false}
        isAnswerCorrect={false}
        isBlocked={true}
        blockedReason='Execute o código antes de verificar.'
        onClick={onClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'Verificar' })
    expect(button).toBeDisabled()
    expect(screen.getByText('Execute o código antes de verificar.')).toBeInTheDocument()

    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should stay disabled when there is no answer', () => {
    render(
      <VerificationButton
        isAnswered={false}
        isAnswerVerified={false}
        isAnswerCorrect={false}
        onClick={jest.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Verificar' })).toBeDisabled()
  })
})
