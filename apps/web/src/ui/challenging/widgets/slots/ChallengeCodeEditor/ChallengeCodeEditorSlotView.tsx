import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'
import { CodeEditor } from '@/ui/global/widgets/components/CodeEditor'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'
import { SelectionActionButtonView } from '@/ui/challenging/widgets/components/SelectionActionButton/SelectionActionButtonView'

type Position = {
  top: number
  left: number
}

type Props = {
  editorContainerRef: React.RefObject<HTMLDivElement | null>
  codeEditorRef: React.RefObject<CodeEditorRef | null>
  codeEditorHeight: number
  originalCode: string
  initialCode: string
  isCodeCheckerDisabled: boolean
  onCodeChange: (value: string) => void
  onRunCode: () => void
  isAssistantEnabled: boolean
  isSelectionButtonVisible: boolean
  selectionButtonPosition: Position
  onAddCodeSelection: () => void
}

export const ChallengeCodeEditorSlotView = ({
  editorContainerRef,
  codeEditorRef,
  codeEditorHeight,
  originalCode,
  initialCode,
  isCodeCheckerDisabled,
  onCodeChange,
  onRunCode,
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
