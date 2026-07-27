import { render, screen } from '@testing-library/react'

import Default from '../default'

jest.mock('@/ui/challenging/widgets/slots/ChallengeOfficialSolution', () => ({
  ChallengeOfficialSolutionSlot: () => (
    <div data-testid='challenge-official-solution-slot' />
  ),
}))

describe('Challenge official solution default slot', () => {
  it('should render the challenge official solution slot', async () => {
    render(await Default())

    expect(screen.getByTestId('challenge-official-solution-slot')).toBeInTheDocument()
  })
})
