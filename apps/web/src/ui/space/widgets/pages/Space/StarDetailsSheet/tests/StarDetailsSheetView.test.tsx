import { fireEvent, render, screen } from '@testing-library/react'

import { type Props, StarDetailsSheetView } from '../StarDetailsSheetView'

jest.mock('../../StarDetails', () => ({
  StarDetails: () => <button type='button'>Começar história</button>,
}))

describe('StarDetailsSheetView', () => {
  const View = (props?: Partial<Props>) => {
    render(<StarDetailsSheetView isOpen={true} onClose={jest.fn()} {...props} />)
  }

  it('should render the star details with an accessible action when open', () => {
    View()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar história' })).toBeInTheDocument()
  })

  it('should render nothing when closed', () => {
    View({ isOpen: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should call onClose when the close button is clicked', () => {
    const onClose = jest.fn()
    View({ onClose })

    fireEvent.click(screen.getByRole('button', { name: 'Fechar detalhes da estrela' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
