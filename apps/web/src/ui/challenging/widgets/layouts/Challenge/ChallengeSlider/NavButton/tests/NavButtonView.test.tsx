import { render, screen } from '@testing-library/react'

import { NavButtonView } from '../NavButtonView'

describe('NavButtonView', () => {
  it('should apply active styles when active', () => {
    render(
      <NavButtonView isActive={true} type='button'>
        Active
      </NavButtonView>,
    )

    const button = screen.getByRole('button', { name: 'Active' })
    expect(button).toHaveClass('text-green-400')
  })

  it('should apply inactive styles when not active', () => {
    render(
      <NavButtonView isActive={false} type='button'>
        Inactive
      </NavButtonView>,
    )

    const button = screen.getByRole('button', { name: 'Inactive' })
    expect(button).toHaveClass('text-gray-100')
  })
})
