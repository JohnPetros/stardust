import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { GalaxiesLoadFailureView, type Props } from '../GalaxiesLoadFailureView'

describe('GalaxiesLoadFailureView', () => {
  const View = (props?: Partial<Props>) => {
    render(<GalaxiesLoadFailureView onRetry={jest.fn()} {...props} />)
  }

  it('should announce the failure as an alert', () => {
    View()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar as galáxias',
    )
  })

  it('should reassure the user that the progress is saved', () => {
    View()

    expect(screen.getByText(/Seu progresso continua salvo/)).toBeInTheDocument()
  })

  it('should call onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()
    View({ onRetry })

    await user.click(screen.getByTestId('retry-button'))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
