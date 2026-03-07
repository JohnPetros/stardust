import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

jest.mock('@/ui/global/widgets/components/CodeEditorToolbar', () => ({
  CodeEditorToolbar: ({ originalCode, onRunCode, onOpenConsole, children }: any) => (
    <div data-testid='code-editor-toolbar' data-original-code={originalCode}>
      <button type='button' onClick={onRunCode}>
        Run code
      </button>
      <button type='button' onClick={onOpenConsole}>
        Open console
      </button>
      {children}
    </div>
  ),
}))

jest.mock('@/ui/global/widgets/components/CodeEditor', () => ({
  CodeEditor: ({ value, height, onChange, isCodeCheckerDisabled }: any) => (
    <div
      data-testid='code-editor'
      data-value={value}
      data-height={String(height)}
      data-code-checker-disabled={String(isCodeCheckerDisabled)}
    >
      <button type='button' onClick={() => onChange('updated code')}>
        Change code
      </button>
    </div>
  ),
}))

jest.mock('@/ui/global/widgets/components/Console', () => ({
  Console: ({ outputs, height, shouldRenderInPortal }: any) => (
    <div
      data-testid='console'
      data-height={String(height)}
      data-should-render-in-portal={String(shouldRenderInPortal)}
    >
      {outputs.join('|')}
    </div>
  ),
}))

jest.mock(
  '@/ui/challenging/widgets/components/SelectionActionButton/SelectionActionButtonView',
  () => ({
    SelectionActionButtonView: ({ label, position, onClick }: any) => (
      <button
        type='button'
        data-testid='selection-action-button'
        data-top={String(position.top)}
        data-left={String(position.left)}
        onClick={onClick}
      >
        {label}
      </button>
    ),
  }),
)

import { ChallengeCodeEditorSlotView } from '../ChallengeCodeEditorSlotView'

describe('ChallengeCodeEditorSlotView', () => {
  const View = (props?: Partial<ComponentProps<typeof ChallengeCodeEditorSlotView>>) => {
    render(
      <ChallengeCodeEditorSlotView
        editorContainerRef={{ current: null }}
        codeEditorRef={{ current: null }}
        codeEditorHeight={320}
        consoleRef={{ current: null }}
        outputs={['linha 1', 'linha 2']}
        isMobile={false}
        originalCode='original code'
        initialCode='initial code'
        isCodeCheckerDisabled={false}
        onCodeChange={jest.fn()}
        onRunCode={jest.fn()}
        onOpenConsole={jest.fn()}
        isAssistantEnabled={true}
        isSelectionButtonVisible={true}
        selectionButtonPosition={{ top: 12, left: 24 }}
        onAddCodeSelection={jest.fn()}
        {...props}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render toolbar, editor and console with derived props', () => {
    View({ isMobile: true, isCodeCheckerDisabled: true })

    expect(screen.getByTestId('code-editor-toolbar')).toHaveAttribute(
      'data-original-code',
      'original code',
    )
    expect(screen.getByTestId('code-editor')).toHaveAttribute(
      'data-value',
      'initial code',
    )
    expect(screen.getByTestId('code-editor')).toHaveAttribute('data-height', '280')
    expect(screen.getByTestId('code-editor')).toHaveAttribute(
      'data-code-checker-disabled',
      'true',
    )
    expect(screen.getByTestId('console')).toHaveAttribute('data-height', '320')
    expect(screen.getByTestId('console')).toHaveAttribute(
      'data-should-render-in-portal',
      'true',
    )
    expect(screen.getByTestId('console')).toHaveTextContent('linha 1|linha 2')
  })

  it('should call forwarded handlers from child components', async () => {
    const user = userEvent.setup()
    const onRunCode = jest.fn()
    const onOpenConsole = jest.fn()
    const onCodeChange = jest.fn()
    const onAddCodeSelection = jest.fn()

    View({ onRunCode, onOpenConsole, onCodeChange, onAddCodeSelection })

    await user.click(screen.getByText('Run code'))
    await user.click(screen.getByText('Open console'))
    await user.click(screen.getByText('Change code'))
    await user.click(screen.getByTestId('selection-action-button'))

    expect(onRunCode).toHaveBeenCalledTimes(1)
    expect(onOpenConsole).toHaveBeenCalledTimes(1)
    expect(onCodeChange).toHaveBeenCalledWith('updated code')
    expect(onAddCodeSelection).toHaveBeenCalledTimes(1)
  })

  it('should render selection action button when assistant selection is enabled', () => {
    View()

    expect(screen.getByTestId('selection-action-button')).toHaveTextContent('Adicionar')
    expect(screen.getByTestId('selection-action-button')).toHaveAttribute(
      'data-top',
      '12',
    )
    expect(screen.getByTestId('selection-action-button')).toHaveAttribute(
      'data-left',
      '24',
    )
  })

  it('should not render selection action button when assistant is disabled', () => {
    View({ isAssistantEnabled: false })

    expect(screen.queryByTestId('selection-action-button')).not.toBeInTheDocument()
  })
})
