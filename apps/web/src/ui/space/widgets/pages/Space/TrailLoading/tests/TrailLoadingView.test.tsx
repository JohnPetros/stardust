import { render, screen } from '@testing-library/react'

import { TrailLoadingView } from '../TrailLoadingView'

describe('TrailLoadingView', () => {
  const View = () => {
    render(<TrailLoadingView />)
  }

  it('should announce the loading status', () => {
    View()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando trilha…')
  })

  it('should render the placeholders hidden from assistive technologies', () => {
    View()

    expect(screen.getByRole('status').querySelector('ul')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(screen.getByRole('status').querySelectorAll('li')).toHaveLength(3)
  })
})
