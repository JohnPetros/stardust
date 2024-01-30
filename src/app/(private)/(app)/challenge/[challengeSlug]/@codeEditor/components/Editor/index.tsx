'use client'

import { useEditor } from './useEditor'

import { CodeEditor } from '@/app/components/CodeEditor'
import { CodeEditorToolbar } from '@/app/components/CodeEditorToolbar'

export function Editor() {
  const {
    initialCode,
    userCode,
    previousUserCode,
    editorContainerRef,
    codeEditorRef,
    codeEditorHeight,
    handleCodeChange,
    handleRunCode,
  } = useEditor()

  return (
    <div ref={editorContainerRef} className="relative h-full w-full">
      <CodeEditorToolbar
        previousUserCode={previousUserCode}
        codeEditorRef={codeEditorRef}
        onRunCode={() => handleRunCode(userCode.current)}
      >
        <CodeEditor
          ref={codeEditorRef}
          value={initialCode ?? ''}
          width="100%"
          height={codeEditorHeight - 40}
          hasMinimap
          onChange={handleCodeChange}
        />
      </CodeEditorToolbar>
    </div>
  )
}
