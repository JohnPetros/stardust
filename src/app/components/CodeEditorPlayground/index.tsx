'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Console } from '../Console'
import { Prompt } from '../Prompt'

import { useCodeEditorPlayground } from './useCodeEditorPlayground'

import { CodeEditor, CodeEditorRef } from '@/app/components/Editor'

export interface CodeEditorPlaygroundRef extends CodeEditorRef {
  runUserCode: () => void
}

type PlaygroundCodeProps = {
  height: number
  code: string
  isRunnable?: boolean
}

export const useCodeEditorPlaygroundComponent = (
  { code, height, isRunnable = false }: PlaygroundCodeProps,
  ref: ForwardedRef<CodeEditorPlaygroundRef>
) => {
  const {
    output,
    codeEditorRef,
    consoleRef,
    promptRef,
    runUserCode,
    handleCodeChange,
    onPromptCancel,
    onPromptConfirm,
  } = useCodeEditorPlayground(code)

  useImperativeHandle(
    ref,
    () => {
      return {
        runUserCode,
        ...codeEditorRef.current,
      } as CodeEditorPlaygroundRef
    },
    [codeEditorRef, runUserCode]
  )

  return (
    <div className="h-full w-full border-2 border-gray-700 pt-2">
      <CodeEditor
        ref={codeEditorRef}
        width="100%"
        height={height}
        value={code}
        isReadOnly={!isRunnable}
        onChange={handleCodeChange}
      />

      {isRunnable && (
        <Prompt
          ref={promptRef}
          onConfirm={onPromptConfirm}
          onCancel={onPromptCancel}
        />
      )}

      {isRunnable && (
        <Console ref={consoleRef} results={output} height={height} />
      )}
    </div>
  )
}

export const CodeEditorPlayground = forwardRef(useCodeEditorPlaygroundComponent)
