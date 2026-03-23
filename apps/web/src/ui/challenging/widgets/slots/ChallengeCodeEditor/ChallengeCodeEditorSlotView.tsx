import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'
import { CodeEditor } from '@/ui/global/widgets/components/CodeEditor'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'
import { Console } from '@/ui/global/widgets/components/Console'
import type { ConsoleRef } from '@/ui/global/widgets/components/Console/types'
import { SelectionActionButtonView } from '@/ui/challenging/widgets/components/SelectionActionButton/SelectionActionButtonView'

type Position = {
  top: number
  left: number
}

type Props = {
  editorContainerRef: React.RefObject<HTMLDivElement | null>
  codeEditorRef: React.RefObject<CodeEditorRef | null>
  codeEditorHeight: number
  consoleRef: React.RefObject<ConsoleRef | null>
  outputs: string[]
  isMobile: boolean
  originalCode: string
  initialCode: string
  isCodeCheckerDisabled: boolean
  onCodeChange: (value: string) => void
  onRunCode: () => void
  onOpenConsole: () => void
  isAssistantEnabled: boolean
  isSelectionButtonVisible: boolean
  selectionButtonPosition: Position
  onAddCodeSelection: () => void
}

export const ChallengeCodeEditorSlotView = ({
  editorContainerRef,
  codeEditorRef,
  codeEditorHeight,
  consoleRef,
  outputs,
  isMobile,
  originalCode,
  initialCode,
  isCodeCheckerDisabled,
  onCodeChange,
  onRunCode,
  onOpenConsole,
  isAssistantEnabled,
  isSelectionButtonVisible,
  selectionButtonPosition,
  onAddCodeSelection,
}: Props) => {
  return (
    <div ref={editorContainerRef} className='relative h-full w-full'>
      <CodeEditorToolbar
        originalCode={originalCode}
        codeEditorRef={codeEditorRef}
        onRunCode={onRunCode}
        onOpenConsole={onOpenConsole}
      >
        <CodeEditor
          ref={codeEditorRef}
          value={initialCode ?? ''}
          width='100%'
          height={codeEditorHeight - 40}
          onChange={onCodeChange}
          isCodeCheckerDisabled={isCodeCheckerDisabled}
        />
      </CodeEditorToolbar>
      <Console
        ref={consoleRef}
        outputs={outputs}
        height={codeEditorHeight}
        shouldRenderInPortal={isMobile}
      />
      {isAssistantEnabled && isSelectionButtonVisible && (
        <SelectionActionButtonView
          label='Adicionar'
          iconName='code'
          position={selectionButtonPosition}
          onClick={onAddCodeSelection}
        />
      )}
    </div>
  )
}
