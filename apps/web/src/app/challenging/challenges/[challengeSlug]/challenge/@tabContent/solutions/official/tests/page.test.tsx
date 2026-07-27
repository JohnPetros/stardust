import { render, screen } from '@testing-library/react'

import Page from '../page'

jest.mock('@/ui/challenging/widgets/slots/ChallengeOfficialSolution', () => ({
  ChallengeOfficialSolutionSlot: () => (
    <div data-testid='challenge-official-solution-slot' />
  ),
}))

describe('Challenge official solution page', () => {
  it('should render the challenge official solution slot', async () => {
    render(await Page())

    expect(screen.getByTestId('challenge-official-solution-slot')).toBeInTheDocument()
  })
})
