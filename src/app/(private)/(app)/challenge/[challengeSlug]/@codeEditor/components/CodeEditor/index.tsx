'use client'

import { useCodeEditor } from './useCodeEditor'

import { CodeEditorToolbar } from '@/app/components/CodeEditorToolbar'
import { Editor } from '@/global/components/Editor'

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
    <div ref={editorContainerRef} className="relative h-full w-full">
      <CodeEditorToolbar
        previousUserCode={previousUserCode}
        codeEditorRef={editorRef}
        onRunCode={() => handleRunCode(userCode.current)}
      >
        <Editor
          ref={editorRef}
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
