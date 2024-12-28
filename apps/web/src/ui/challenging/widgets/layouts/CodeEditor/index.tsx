'use client'

import { Editor } from '@/ui/global/widgets/components/Editor'
import { useCodeEditor } from './useCodeEditor'

export function CodeEditor() {
  const {
    initialCode,
    userCode,
    previousUserCode,
    editorContainerRef,
    editorRef,
    codeEditorHeight,
    handleCodeChange,
    handleRunCode,
  } = useCodeEditor()

  return (
    <div ref={editorContainerRef} className='relative h-full w-full'>
      <CodeEditorToolbar
        previousUserCode={previousUserCode}
        codeEditorRef={editorRef}
        onRunCode={handleRunCode}
      >
        <Editor
          ref={editorRef}
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
