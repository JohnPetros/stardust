import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

jest.mock('@/ui/global/widgets/components/Toolbar', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
  Button: ({ label, onClick }: any) => (
    <button type='button' onClick={onClick}>
      {label}
    </button>
  ),
}))

jest.mock('../../Button', () => ({
  Button: ({ children, onClick }: any) => (
    <button type='button' onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('../../AlertDialog', () => ({
  AlertDialog: ({ children }: any) => <>{children}</>,
}))

jest.mock('../GuidesDialog', () => ({
  GuidesDialog: ({ children }: any) => <>{children}</>,
}))

jest.mock('../HotkeysDialog', () => ({
  HotkeysDialog: ({ children }: any) => <>{children}</>,
}))

jest.mock('../CodeEditorSettingsDialog', () => ({
  CodeEditorSettingsDialog: ({ children }: any) => <>{children}</>,
}))

const { CodeEditorToolbarView } = require('../CodeEditorToolbarView')

describe('CodeEditorToolbarView', () => {
  const View = (props?: Partial<ComponentProps<typeof CodeEditorToolbarView>>) => {
    render(
      <CodeEditorToolbarView
        runCodeButtonRef={{ current: null }}
        guidesDialogButtonRef={{ current: null }}
        isAssistantAllowed={false}
        onRunCode={jest.fn()}
        onOpenConsole={jest.fn()}
        onKeyDown={jest.fn()}
        onResetCodeButtonClick={jest.fn()}
        onAssistantEnabledChange={jest.fn()}
        {...props}
      >
        <div>editor</div>
      </CodeEditorToolbarView>,
    )
  }

  it('should call onOpenConsole when console button is clicked', async () => {
    const user = userEvent.setup()
    const onOpenConsole = jest.fn()

    View({ onOpenConsole })

    await user.click(screen.getByText('Console'))

    expect(onOpenConsole).toHaveBeenCalledTimes(1)
  })

  it('should not render the console button when no console handler is provided', () => {
    View({ onOpenConsole: undefined })

    expect(screen.queryByText('Console')).not.toBeInTheDocument()
  })

  it('should render custom actions inside the toolbar when provided', () => {
    View({
      customActions: <button type='button'>Exemplos</button>,
    })

    expect(screen.getByRole('button', { name: 'Exemplos' })).toBeInTheDocument()
  })

  it('should not render assistant button when shouldHideAssistantButton is true', () => {
    View({
      isAssistantAllowed: true,
      shouldHideAssistantButton: true,
    })

    expect(
      screen.queryByRole('button', { name: 'Assistente de código' }),
    ).not.toBeInTheDocument()
  })

  it('should render assistant button when assistant is allowed and hide flag is not provided', () => {
    View({
      isAssistantAllowed: true,
    })

    expect(
      screen.getByRole('button', { name: 'Assistente de código' }),
    ).toBeInTheDocument()
  })
})
