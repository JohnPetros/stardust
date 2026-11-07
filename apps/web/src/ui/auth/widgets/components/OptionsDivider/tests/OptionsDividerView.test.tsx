import { render, screen } from '@testing-library/react'

import { OptionsDividerView } from '../OptionsDividerView'

describe('OptionsDividerView', () => {
  const View = (props?: Partial<Parameters<typeof OptionsDividerView>[0]>) =>
    render(<OptionsDividerView label='ou' {...props} />)

  it('should render the label', () => {
    View()

    expect(screen.getByText('ou')).toBeVisible()
  })

  it('should render a custom label', () => {
    View({ label: 'ou continue com' })

    expect(screen.getByText('ou continue com')).toBeVisible()
  })

  it('should render two lines around the label', () => {
    View()

    const lines = screen.getAllByTestId('options-divider-line')
    const divider = screen.getByTestId('options-divider')

    expect(lines).toHaveLength(2)
    expect(divider.firstElementChild).toBe(lines[0])
    expect(divider.lastElementChild).toBe(lines[1])
    expect(screen.getByText('ou').previousElementSibling).toBe(lines[0])
    expect(screen.getByText('ou').nextElementSibling).toBe(lines[1])
  })
})
