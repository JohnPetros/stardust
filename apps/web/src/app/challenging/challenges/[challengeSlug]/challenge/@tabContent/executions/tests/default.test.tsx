import { render, screen } from '@testing-library/react'

import Default from '../default'

jest.mock('@/ui/challenging/widgets/slots/ChallengeCodeExecutions', () => ({
  ChallengeCodeExecutionsSlot: () => <div data-testid='executions-slot' />,
}))

describe('Challenge executions default slot', () => {
  it('should render the challenge code executions slot', () => {
    render(<Default />)

    expect(screen.getByTestId('executions-slot')).toBeInTheDocument()
  })
})
