import { render, screen } from '@testing-library/react'

import { AppMessageView } from '../AppMessageView'

jest.mock('motion/react', () => ({
  motion: {
    div: ({ initial, animate, exit, variants, transition, ...props }: any) => (
      <div
        {...props}
        data-initial-variant={initial}
        data-animate-variant={animate}
        data-exit-variant={exit}
        data-has-variants={Boolean(variants)}
      />
    ),
  },
}))

jest.mock('@/ui/global/widgets/components/Animation', () => ({
  Animation: ({ name }: { name: string }) => <div data-testid={`animation-${name}`} />,
}))

describe('AppMessageView', () => {
  const View = (props?: Partial<Parameters<typeof AppMessageView>[0]>) =>
    render(
      <AppMessageView
        title='Perfil criado'
        subtitle='Tudo pronto para começar'
        footer={<button type='button'>Ir para o espaço</button>}
        {...props}
      />,
    )

  it('should render the title as a heading', () => {
    View()

    expect(screen.getByRole('heading', { level: 1, name: 'Perfil criado' })).toBeVisible()
  })

  it('should render the subtitle', () => {
    View()

    expect(screen.getByText('Tudo pronto para começar')).toBeVisible()
  })

  it('should render the footer', () => {
    View()

    expect(screen.getByRole('button', { name: 'Ir para o espaço' })).toBeVisible()
  })

  it('should render the apollo-asking animation', () => {
    View()

    expect(screen.getByTestId('animation-apollo-asking')).toBeInTheDocument()
  })

  it('should animate in and out with the hidden and visible variants', () => {
    const { container } = View()

    const root = container.firstElementChild

    expect(root).toHaveAttribute('data-initial-variant', 'hidden')
    expect(root).toHaveAttribute('data-animate-variant', 'visible')
    expect(root).toHaveAttribute('data-exit-variant', 'hidden')
    expect(root).toHaveAttribute('data-has-variants', 'true')
  })
})
