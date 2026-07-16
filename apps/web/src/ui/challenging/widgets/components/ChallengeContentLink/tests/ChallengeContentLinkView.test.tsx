import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ChallengeContentLinkView, type Props } from '../ChallengeContentLinkView'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span data-testid='lock-icon' />,
}))

describe('ChallengeContentLinkView', () => {
  const View = (props?: Partial<Props>) => {
    render(
      <ChallengeContentLinkView
        href='/desafios/desafio'
        title='Soluções'
        isActive={false}
        isBlocked={false}
        {...props}
      />,
    )
  }

  it('should forward external props to the blocked button', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const ref = createRef<HTMLButtonElement>()

    render(
      <ChallengeContentLinkView
        ref={ref}
        href='/desafios/desafio/solutions'
        title='Soluções'
        isActive={false}
        isBlocked={true}
        aria-label='Abrir soluções bloqueadas'
        data-testid='blocked-solutions-link'
        onClick={onClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'Abrir soluções bloqueadas' })

    expect(button).toHaveAttribute('data-testid', 'blocked-solutions-link')
    expect(ref.current).toBe(button)

    await user.click(button)

    expect(onClick).toHaveBeenCalled()
  })

  it('should forward external props to the unlocked link', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn((event) => event.preventDefault())

    View({
      isBlocked: false,
      href: '/desafios/desafio/solutions',
      'data-testid': 'solutions-link',
      onClick,
    })

    const link = screen.getByRole('link', { name: 'Soluções' })

    expect(link).toHaveAttribute('href', '/desafios/desafio/solutions')
    expect(link).toHaveAttribute('data-testid', 'solutions-link')

    await user.click(link)

    expect(onClick).toHaveBeenCalled()
  })
})
