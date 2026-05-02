import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cloneElement, isValidElement, useState, type ComponentProps } from 'react'

import { DELEGUA_EXAMPLE_SNIPPETS } from '@stardust/lsp'

jest.mock('@/ui/global/widgets/components/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button type='button' onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/Dialog', () => {
  const React = require('react')

  const DialogContext = React.createContext(null as any)

  const Container = ({ children }: any) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <DialogContext.Provider value={{ isOpen, setIsOpen }}>
        <div>{children}</div>
      </DialogContext.Provider>
    )
  }

  const Trigger = ({ children }: any) => {
    const context = React.useContext(DialogContext)

    return (
      <button type='button' onClick={() => context?.setIsOpen(true)}>
        {children}
      </button>
    )
  }

  const Content = ({ children }: any) => {
    const context = React.useContext(DialogContext)

    if (!context?.isOpen) return null

    return <div data-testid='dialog-content'>{children}</div>
  }

  const Header = ({ children }: any) => <h1>{children}</h1>

  const Close = ({ children }: any) => {
    const context = React.useContext(DialogContext)
    const element = children as any

    if (!isValidElement(children)) return children

    return cloneElement(element, {
      onClick: async (...args: any[]) => {
        await element.props.onClick?.(...args)
        context?.setIsOpen(false)
      },
    })
  }

  return { Container, Trigger, Content, Header, Close }
})

import { SnippetExamplesDialogView } from '../SnippetExamplesDialogView'

describe('SnippetExamplesDialogView', () => {
  const View = (props?: Partial<ComponentProps<typeof SnippetExamplesDialogView>>) => {
    render(
      <SnippetExamplesDialogView
        snippets={DELEGUA_EXAMPLE_SNIPPETS.slice()}
        onSelectSnippet={jest.fn()}
        {...props}
      >
        Abrir exemplos
      </SnippetExamplesDialogView>,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render empty state when there are no snippets', async () => {
    const user = userEvent.setup()

    View({ snippets: [] })

    await user.click(screen.getByRole('button', { name: 'Abrir exemplos' }))

    expect(screen.getByText('Nenhum exemplo disponivel no momento.')).toBeInTheDocument()
  })

  it('should render the first 10 example snippets in the real catalog order', async () => {
    const user = userEvent.setup()

    View()

    await user.click(screen.getByRole('button', { name: 'Abrir exemplos' }))

    const snippetButtons = within(screen.getByTestId('dialog-content')).getAllByRole(
      'button',
    )

    expect(snippetButtons).toHaveLength(10)
    expect(snippetButtons.map((button) => button.textContent)).toEqual(
      DELEGUA_EXAMPLE_SNIPPETS.map((snippet) => snippet.label),
    )
  })

  it('should call onSelectSnippet with the clicked snippet', async () => {
    const user = userEvent.setup()
    const onSelectSnippet = jest.fn()

    View({ onSelectSnippet })

    await user.click(screen.getByRole('button', { name: 'Abrir exemplos' }))
    await user.click(screen.getByRole('button', { name: 'Funcao com retorno' }))

    expect(onSelectSnippet).toHaveBeenCalledTimes(1)
    expect(onSelectSnippet).toHaveBeenCalledWith(DELEGUA_EXAMPLE_SNIPPETS[5])
  })

  it('should close the dialog after selecting a snippet', async () => {
    const user = userEvent.setup()

    View()

    await user.click(screen.getByRole('button', { name: 'Abrir exemplos' }))

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ola mundo' }))

    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
  })
})
