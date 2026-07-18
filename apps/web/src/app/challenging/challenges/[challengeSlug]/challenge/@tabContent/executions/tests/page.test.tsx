import { render, screen } from '@testing-library/react'

import Page from '../page'

jest.mock('@/ui/challenging/widgets/slots/ChallengeCodeExecutions', () => ({
  ChallengeCodeExecutionsSlot: () => <div data-testid='executions-slot' />,
}))

describe('Challenge executions page', () => {
  it('should render the challenge code executions slot', () => {
    render(<Page />)

    expect(screen.getByTestId('executions-slot')).toBeInTheDocument()
  })
})
