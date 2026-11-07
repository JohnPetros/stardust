import { render, screen } from '@testing-library/react'

import { LinkView } from '../LinkView'

describe('LinkView', () => {
  const View = (props?: Partial<Parameters<typeof LinkView>[0]>) =>
    render(
      <LinkView href='/auth/sign-up' testId='sign-up-link' {...props}>
        Criar conta
      </LinkView>,
    )

  it('should render the children inside a link with the given href', () => {
    View()

    const link = screen.getByRole('link', { name: 'Criar conta' })

    expect(link).toHaveAttribute('href', '/auth/sign-up')
  })

  it('should expose the testId as data-testid', () => {
    View()

    expect(screen.getByTestId('sign-up-link')).toBeVisible()
  })

  it('should use the subtle tone by default', () => {
    View()

    const link = screen.getByTestId('sign-up-link')

    expect(link).toHaveClass('text-theme-text-secondary', 'font-normal')
    expect(link).not.toHaveClass('text-theme-accent-text')
  })

  it('should use the subtle tone when tone is subtle', () => {
    View({ tone: 'subtle' })

    const link = screen.getByTestId('sign-up-link')

    expect(link).toHaveClass('text-theme-text-secondary', 'font-normal')
  })

  it('should use the highlight tone when tone is highlight', () => {
    View({ tone: 'highlight' })

    const link = screen.getByTestId('sign-up-link')

    expect(link).toHaveClass('text-theme-accent-text', 'font-medium')
    expect(link).not.toHaveClass('text-theme-text-secondary')
  })

  it('should keep a 44px target and a visible keyboard focus indicator', () => {
    View()

    const link = screen.getByTestId('sign-up-link')

    expect(link).toHaveClass('h-theme-control')
    expect(link).toHaveClass(
      'focus-visible:outline',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-theme-action',
    )
  })
})
