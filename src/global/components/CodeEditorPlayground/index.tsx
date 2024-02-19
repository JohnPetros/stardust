'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Console } from '../Console'
import { Prompt } from '../Prompt'

import { useCodeEditorPlayground } from './useCodeEditorPlayground'

import { Editor, EditorRef } from '@/global/components/Editor'

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
    handlePromptConfirm,
    handlePromptCancel,
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
    <>
      <div className='relative h-full w-full border-2 border-gray-700 pt-2'>
        <Editor
          ref={editorRef}
          width='100%'
          height={height}
          value={code}
          isReadOnly={!isRunnable}
          onChange={handleCodeChange}
        />

        {isRunnable && <Console ref={consoleRef} output={output} height={height} />}
      </div>
      {isRunnable && (
        <div className='hidden'>
          <Prompt
            ref={promptRef}
            onConfirm={handlePromptConfirm}
            onCancel={handlePromptCancel}
          />
        </div>
      )}
    </>
  )
}

export const CodeEditorPlayground = forwardRef(CodeEditorPlaygroundComponent)
