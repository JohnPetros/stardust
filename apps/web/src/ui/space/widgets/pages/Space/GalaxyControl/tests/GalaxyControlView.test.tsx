import { render, screen } from '@testing-library/react'

import { ROUTES } from '@/constants'
import { GalaxyControlView, type Props } from '../GalaxyControlView'

describe('GalaxyControlView', () => {
  const View = (props?: Partial<Props>) => {
    render(<GalaxyControlView galaxyName='Lógica de Programação' {...props} />)
  }

  it('should render the current galaxy name', () => {
    View()

    expect(screen.getByText('Lógica de Programação')).toBeInTheDocument()
  })

  it('should render the "Ver galáxias" label', () => {
    View()

    expect(screen.getByText('Ver galáxias')).toBeInTheDocument()
  })

  it('should link to the galaxies page', () => {
    View()

    expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.galaxies)
  })

  it('should expose the galaxy name and the action as the accessible name', () => {
    View({ galaxyName: 'Galáxia de Teste' })

    expect(
      screen.getByRole('link', { name: 'Galáxia de Teste: ver galáxias' }),
    ).toBeInTheDocument()
  })
})
