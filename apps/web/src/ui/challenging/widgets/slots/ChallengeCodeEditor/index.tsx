'use client'

import { CodeEditor } from '@/ui/global/widgets/components/CodeEditor'
import { useChallengeCodeEditorSlot } from './useChallengeCodeEditorSlot'
import { CodeEditorToolbar } from '@/ui/global/widgets/components/CodeEditorToolbar'

export function ChallengeCodeEditorSlot() {
  const {
    initialCode,
    originalCode,
    editorContainerRef,
    codeEditorRef,
    codeEditorHeight,
    handleCodeChange,
    handleRunCode,
  } = useChallengeCodeEditorSlot()

  return (
    <div ref={editorContainerRef} className='relative h-full w-full'>
      <CodeEditorToolbar
        originalCode={originalCode}
        codeEditorRef={codeEditorRef}
        onRunCode={handleRunCode}
      >
        <CodeEditor
          ref={codeEditorRef}
          value={initialCode ?? ''}
          width='100%'
          height={codeEditorHeight - 40}
          hasMinimap
          onChange={handleCodeChange}
        />
      </CodeEditorToolbar>
    </div>
  )
}
