'use client'

import { useEditor } from './useEditor'

import { Button } from '@/app/components/Button'
import { CodeEditor } from '@/app/components/CodeEditor'
import { CodeEditorToolbar } from '@/app/components/CodeEditorToolbar'

export function Editor() {
  const {
    initialCode,
    userCode,
    editorContainerRef,
    runCodeButtonRef,
    codeEditorRef,
    codeEditorHeight,
    resetCode,
    handleCodeChange,
    handleKeyDown,
    handleRunCode,
  } = useEditor()

  return (
    <div
      ref={editorContainerRef}
      className="relative w-full"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between rounded-t-md bg-gray-700 px-3 py-2">
        <div className="flex items-center gap-4">
          <Button
            buttonRef={runCodeButtonRef}
            className="h-6 w-max px-3 text-xs"
            onClick={() => handleRunCode(userCode.current)}
          >
            Executar
          </Button>
        </div>

        <CodeEditorToolbar onResetCode={resetCode} />
      </div>

      <CodeEditor
        ref={codeEditorRef}
        value={initialCode ?? ''}
        width="100%"
        height={codeEditorHeight - 40}
        hasMinimap
        onChange={handleCodeChange}
      />
    </div>
  )
}
