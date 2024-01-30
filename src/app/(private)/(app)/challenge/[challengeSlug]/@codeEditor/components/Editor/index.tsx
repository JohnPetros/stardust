'use client'

import { useEditor } from './useEditor'

import { Button } from '@/app/components/Button'
import { CodeEditor } from '@/app/components/CodeEditor'
import { CodeEditorToolbar } from '@/app/components/CodeEditorToolbar'
import {
  CodeEditorToolbarContext,
  CodeEditorToolbarProvider,
} from '@/contexts/CodeEditorToolbarContext'

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
    handleRunCode,
  } = useEditor()

  return (
    <div ref={editorContainerRef} className="relative h-full w-full">
      <CodeEditorToolbarProvider
        codeEditorRef={codeEditorRef}
        onRunCode={() => handleRunCode(userCode.current)}
        onChangeCode={handleCodeChange}
        onResetCode={resetCode}
      >
        <CodeEditor
          ref={codeEditorRef}
          value={initialCode ?? ''}
          width="100%"
          height={codeEditorHeight - 40}
          hasMinimap
          onChange={handleCodeChange}
        />
      </CodeEditorToolbarProvider>
      {/* <div className="flex items-center justify-between rounded-t-md bg-gray-700 px-3 py-2">
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
      </div> */}
    </div>
  )
}
