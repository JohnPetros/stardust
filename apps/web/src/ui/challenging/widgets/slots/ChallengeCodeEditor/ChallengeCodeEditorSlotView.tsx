import type { CodeEditorRef } from '@/ui/global/widgets/components/CodeEditor/types'
import { CodeEditor } from '@/ui/global/widgets/components/CodeEditor'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'

type Props = {
  editorContainerRef: React.RefObject<HTMLDivElement>
  codeEditorRef: React.RefObject<CodeEditorRef>
  codeEditorHeight: number
  originalCode: string
  initialCode: string
  onCodeChange: (value: string) => void
  onRunCode: () => void
}
export const ChallengeCodeEditorSlotView = ({
  editorContainerRef,
  codeEditorRef,
  codeEditorHeight,
  originalCode,
  initialCode,
  onCodeChange,
  onRunCode,
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
          hasMinimap
          onChange={onCodeChange}
        />
      </CodeEditorToolbar>
    </div>
  )
}
