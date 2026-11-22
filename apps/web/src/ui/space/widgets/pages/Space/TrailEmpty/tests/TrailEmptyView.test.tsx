import { render, screen } from '@testing-library/react'

import { TrailEmptyView } from '../TrailEmptyView'

describe('TrailEmptyView', () => {
  it('should render the empty trail message', () => {
    render(<TrailEmptyView />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Nenhum conteúdo disponível nesta trilha.',
    )
  })
})
