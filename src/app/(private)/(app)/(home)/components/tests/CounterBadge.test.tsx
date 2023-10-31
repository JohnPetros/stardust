import { render, screen } from '@testing-library/react'

import { CounterBadge } from '../CounterBadge'

describe('CounterBadge component', () => {
  it('should render count correctly', () => {
    render(<CounterBadge count={7} />)

    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('should render a count below one', () => {
    render(<CounterBadge count={0} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
