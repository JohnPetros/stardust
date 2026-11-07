import { render, screen } from '@testing-library/react'
import { Root } from '@radix-ui/react-dialog'

import { DialogHeaderView } from '../DialogHeaderView'

describe('DialogHeaderView', () => {
  const View = (props?: Partial<Parameters<typeof DialogHeaderView>[0]>) => {
    return render(
      <Root open>
        <DialogHeaderView {...props}>
          {props?.children ?? 'Editar perfil'}
        </DialogHeaderView>
      </Root>,
    )
  }

  it('should render its children as the accessible title of the dialog', () => {
    View()

    const title = screen.getByRole('heading', { name: 'Editar perfil', level: 2 })

    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-theme-text-primary')
  })

  it('should render a close button labeled as "Fechar"', () => {
    View()

    const closeButton = screen.getByRole('button', { name: 'Fechar' })

    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveClass(
      'size-11',
      'rounded-theme',
      'text-theme-text-secondary',
    )
  })

  it('should use the quiet border token on the header by default', () => {
    View()

    const header = screen.getByRole('banner')

    expect(header).toHaveClass('border-b', 'border-theme-border-quiet', 'pb-2')
  })

  it('should let the caller class name override conflicting header utilities', () => {
    View({ className: 'pb-6 custom-header' })

    const header = screen.getByRole('banner')

    expect(header).toHaveClass('pb-6', 'custom-header', 'border-theme-border-quiet')
    expect(header).not.toHaveClass('pb-2')
  })
})
