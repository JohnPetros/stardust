import { render, screen } from '@testing-library/react'
import { CodePlaybacksFaker } from '@stardust/core/global/structures/fakers'

import { ChallengeOfficialSolutionSlotView } from '../ChallengeOfficialSolutionSlotView'

jest.mock('@/ui/global/widgets/components/CodePlayback', () => ({
  CodePlayback: () => <div data-testid='code-playback' />,
}))
jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span aria-hidden='true' />,
}))

describe('ChallengeOfficialSolutionSlotView', () => {
  it('renders Code Playback when the official solution exists', () => {
    render(
      <ChallengeOfficialSolutionSlotView
        challengeSlug='example'
        officialSolution={CodePlaybacksFaker.fakeDto()}
      />,
    )

    expect(screen.getByTestId('code-playback')).toBeInTheDocument()
    expect(screen.queryByTestId('official-solution-empty')).not.toBeInTheDocument()
  })

  it('renders an unavailable state without throwing when there is no solution', () => {
    render(
      <ChallengeOfficialSolutionSlotView
        challengeSlug='example'
        officialSolution={null}
      />,
    )

    expect(screen.getByTestId('official-solution-empty')).toHaveTextContent(
      'Solução oficial indisponível',
    )
    expect(screen.getByRole('link', { name: /Ver todas as soluções/i })).toHaveAttribute(
      'href',
      '/challenging/challenges/example/challenge/solutions',
    )
  })
})
