'use client'

import { useMemo, useRef } from 'react'
import { CodeEditor, CodeEditorRef } from '@/app/components/CodeEditor'
import { Button } from '@/app/components/Button'
import { ArrowClockwise } from '@phosphor-icons/react'

interface CodeSnippetProps {
  code: string
}

export function CodeSnippet({ code }: CodeSnippetProps) {
  const codeEditorRef = useRef<CodeEditorRef>(null)

  function handleReloadButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  const codeEditorHeight = useMemo(() => {
    return code.split('\n').length * 10 + 200
  }, [code])

  return (
    <div className="rounded-md bg-gray-800 w-full">
      <div className="flex items-center justify-end gap-2 border-b border-gray-700 p-2">
        <Button className="h-8 w-max px-4" onClick={handleReloadButtonClick}>
          <ArrowClockwise className="text-green-900" weight="bold" />
        </Button>
        <Button className="h-8 w-max px-4 text-sm">
          Executar
        </Button>
      </div>

      <CodeEditor ref={codeEditorRef} width="100%" height={codeEditorHeight} value={code} />
    </div>
  )
}
