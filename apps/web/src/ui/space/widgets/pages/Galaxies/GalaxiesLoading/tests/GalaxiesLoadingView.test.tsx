import { render, screen } from '@testing-library/react'

import { GalaxiesLoadingView } from '../GalaxiesLoadingView'

describe('GalaxiesLoadingView', () => {
  it('should announce the loading state as a status', () => {
    render(<GalaxiesLoadingView />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando galáxias…')
  })

  it('should render two placeholders hidden from assistive technology', () => {
    const { container } = render(<GalaxiesLoadingView />)

    const list = container.querySelector('ul')
    expect(list).toHaveAttribute('aria-hidden', 'true')
    expect(list?.querySelectorAll('li')).toHaveLength(2)
  })
})
