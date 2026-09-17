import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'

import { ChallengePageView } from '../ChallengePageView'

jest.mock('@/ui/global/widgets/components/AlertDialog', () => ({
  AlertDialog: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span aria-hidden='true' />,
}))

jest.mock('@/ui/global/widgets/components/Loading', () => ({
  Loading: () => <span role='status' />,
}))

jest.mock('../../../components/ConfettiAnimation', () => ({
  ConfettiAnimation: () => null,
}))

describe('ChallengePageView', () => {
  it('renders the contextual back action and challenge title', () => {
    render(
      <ChallengePageView
        challengeTitle='Soma de números'
        shouldHaveConfettiAnimation={false}
        layoutControlsSlot={null}
        notesSlot={null}
        challengeNavigationSlot={null}
        challengeNavigationAlertDialogSlot={null}
        handleBackButtonClick={jest.fn()}
        backButtonLabel='Voltar para o roadmap'
      />,
    )

    expect(screen.getByRole('heading', { name: 'Soma de números' })).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Voltar para o roadmap' }),
    ).toBeVisible()
  })

  it('renders a loading state before the challenge is available', () => {
    render(
      <ChallengePageView
        challengeTitle={null}
        shouldHaveConfettiAnimation={false}
        layoutControlsSlot={null}
        notesSlot={null}
        challengeNavigationSlot={null}
        challengeNavigationAlertDialogSlot={null}
        handleBackButtonClick={jest.fn()}
      />,
    )

    expect(screen.getByRole('status')).toBeVisible()
  })
})
