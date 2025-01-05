'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Prompt } from '../Prompt'

import { Console } from '../Console'
import { usePlaygroundCodeEditor } from './usePlaygroundCodeEditor'
import type { PlaygroundCodeEditorRef } from './types'

import { CodeEditor } from '../CodeEditor'
type PlaygroundCodeProps = {
  height: number
  code: string
  isRunnable?: boolean
  onCodeChange?: (code: string) => void
}

export const PlaygroundCodeEditorComponent = (
  { code, height, isRunnable = false, onCodeChange }: PlaygroundCodeProps,
  ref: ForwardedRef<PlaygroundCodeEditorRef>,
) => {
  const {
    outputs,
    codeEditorRef,
    consoleRef,
    promptRef,
    runCode,
    handleCodeChange,
    handlePromptConfirm,
    handlePromptCancel,
  } = usePlaygroundCodeEditor(code, onCodeChange)

  useImperativeHandle(
    ref,
    () => {
      return {
        runCode,
        ...codeEditorRef.current,
      } as PlaygroundCodeEditorRef
    },
    [codeEditorRef, runCode],
  )

  return (
    <>
      <div className='relative h-full w-full border-2 border-gray-700 pt-2'>
        <CodeEditor
          ref={codeEditorRef}
          width='100%'
          height={height}
          value={code}
          isReadOnly={!isRunnable}
          onChange={handleCodeChange}
        />

        {isRunnable && <Console ref={consoleRef} outputs={outputs} height={height} />}
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

export const PlaygroundCodeEditor = forwardRef(PlaygroundCodeEditorComponent)
