import { TooltipProvider } from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { NavButton } from '../NavButton'

const labelMock = 'label mock'
const pathMock = 'path mock'
const iconMock = 'icon mock'

function renderNavButton(isExpanded: boolean) {
  render(
    <TooltipProvider>
      <NavButton
        label={labelMock}
        path={pathMock}
        isColumn={true}
        isExpanded={isExpanded}
        icon={iconMock}
      />
    </TooltipProvider>
  )
}

describe('NavButton component', () => {
  it('should render correctly', () => {
    renderNavButton(true)

    expect(screen.getByText(labelMock)).toBeInTheDocument()
    expect(screen.getByAltText(iconMock)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', pathMock)
  })

  it('should show tooltip when not expanded', async () => {
    renderNavButton(false)

    const navButton = screen.getByRole('link')

    await userEvent.hover(navButton)

    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })
})
