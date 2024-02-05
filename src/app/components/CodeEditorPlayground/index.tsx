'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Console } from '../Console'
import { Prompt } from '../Prompt'

import { useCodeEditorPlayground } from './useCodeEditorPlayground'

import { Editor, EditorRef } from '@/app/components/Editor'

export interface CodeEditorPlaygroundRef extends EditorRef {
  runUserCode: () => void
}

type PlaygroundCodeProps = {
  height: number
  code: string
  isRunnable?: boolean
  onCodeChange?: (code: string) => void
}

export const CodeEditorPlaygroundComponent = (
  { code, height, isRunnable = false, onCodeChange }: PlaygroundCodeProps,
  ref: ForwardedRef<CodeEditorPlaygroundRef>
) => {
  const {
    output,
    editorRef,
    consoleRef,
    promptRef,
    runUserCode,
    handleCodeChange,
    onPromptCancel,
    onPromptConfirm,
  } = useCodeEditorPlayground(code, onCodeChange)

  useImperativeHandle(
    ref,
    () => {
      return {
        runUserCode,
        ...editorRef.current,
      } as CodeEditorPlaygroundRef
    },
    [editorRef, runUserCode]
  )

  return (
    <div className="h-full w-full border-2 border-gray-700 pt-2">
      <Editor
        ref={editorRef}
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

export const CodeEditorPlayground = forwardRef(CodeEditorPlaygroundComponent)
