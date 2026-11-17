import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'

import { NavLinkView } from '../NavLinkView'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/ui/global/widgets/components/Tooltip', () => ({
  Tooltip: ({ children, content }: any) => <div data-tooltip={content}>{children}</div>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/NavLink/AnimatedLabel', () => ({
  AnimatedLabel: ({ children, isActive }: any) => (
    <span data-testid='label' data-active={String(isActive)}>
      {children}
    </span>
  ),
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <span data-testid={`icon-${name}`} data-size={size} />
  ),
}))

describe('NavLinkView', () => {
  function View(props?: Partial<ComponentProps<typeof NavLinkView>>) {
    render(
      <NavLinkView
        route='/shop'
        label='Loja'
        icon='store'
        isColumn={false}
        isExpanded={true}
        isActive={false}
        {...props}
      />,
    )
  }

  it('should link to the route and render the received icon at 24px', () => {
    View({ icon: 'graduation-cap', route: '/space' })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/space')
    expect(screen.getByTestId('icon-graduation-cap')).toHaveAttribute('data-size', '24')
  })

  it('should render the label and pass the active state to it', () => {
    View({ isActive: true })

    expect(screen.getByTestId('label')).toHaveTextContent('Loja')
    expect(screen.getByTestId('label')).toHaveAttribute('data-active', 'true')
  })

  it('should highlight the icon tile only when active', () => {
    View({ isActive: true })
    expect(screen.getByTestId('icon-store').parentElement).toHaveClass('bg-green-400')
  })

  it('should keep the default tile color when inactive', () => {
    View({ isActive: false })
    expect(screen.getByTestId('icon-store').parentElement).toHaveClass('bg-green-800')
  })

  it('should show the label as tooltip only when collapsed', () => {
    View({ isExpanded: false })

    expect(screen.getByRole('link').parentElement).toHaveAttribute('data-tooltip', 'Loja')
  })
})
