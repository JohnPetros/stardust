'use client'

import { CodeEditor } from '@/app/components/CodeEditor'
import { Button } from '@/app/components/Button'
import { ArrowClockwise } from '@phosphor-icons/react'
import { useMemo } from 'react'

interface CodeSnippetProps {
  code: string
}

export function CodeSnippet({ code }: CodeSnippetProps) {

  const codeEditorHeight = useMemo(() => {
    return code.split('\n').length * 10 + 200
  }, [code])

  return (
    <div className="rounded-md bg-gray-800 w-full">
      <div className="flex items-center justify-end gap-2 border-b border-gray-700 p-2">
        <Button className="h-8 w-max px-4">
          <ArrowClockwise className="text-green-900" weight="bold" />
        </Button>
        <Button className="h-8 w-max px-4 text-sm">
          Executar
        </Button>
      </div>

      <CodeEditor width="100%" height={codeEditorHeight} code={code} />
    </div>
  )
}
