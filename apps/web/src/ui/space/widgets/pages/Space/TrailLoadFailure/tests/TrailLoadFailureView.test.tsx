import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { type Props, TrailLoadFailureView } from '../TrailLoadFailureView'

describe('TrailLoadFailureView', () => {
  const View = (props?: Partial<Props>) => {
    render(<TrailLoadFailureView onRetry={jest.fn()} {...props} />)
  }

  it('should render the failure title without internal details', () => {
    View()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar a trilha',
    )
  })

  it('should call onRetry when the retry action is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()
    View({ onRetry })

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
