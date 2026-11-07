import { render, screen } from '@testing-library/react'

import { TitleView } from '../TitleView'

describe('TitleView', () => {
  const View = (props?: Partial<Parameters<typeof TitleView>[0]>) =>
    render(
      <TitleView
        title='Bem-vindo(a) ao StarDust'
        text='Entre na sua conta'
        icon='rocket'
        {...props}
      />,
    )

  it('should render the title as a heading', () => {
    View()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Bem-vindo(a) ao StarDust' }),
    ).toBeVisible()
  })

  it('should render the supporting text', () => {
    View()

    expect(screen.getByText('Entre na sua conta')).toBeVisible()
  })

  it('should not render the supporting text when text is empty', () => {
    const { container } = View({ text: '' })

    expect(container.querySelector('p')).toBeNull()
  })

  it('should render the icon next to the title', () => {
    const { container } = View()

    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
