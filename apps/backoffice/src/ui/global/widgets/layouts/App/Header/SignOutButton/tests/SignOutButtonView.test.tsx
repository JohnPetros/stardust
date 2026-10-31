import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SignOutButtonView } from '../SignOutButtonView'

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span data-testid='sign-out-icon' />,
}))

jest.mock('@/ui/shadcn/components/dropdown-menu', () => ({
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick: () => void
  }) => (
    <button onClick={onClick} type='button'>
      {children}
    </button>
  ),
}))

describe('SignOutButtonView', () => {
  it('should render label and call onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(<SignOutButtonView onClick={onClick} />)

    expect(screen.getByText('Sign out')).toBeInTheDocument()
    expect(screen.getByTestId('sign-out-icon')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(onClick).toHaveBeenCalled()
  })
})
