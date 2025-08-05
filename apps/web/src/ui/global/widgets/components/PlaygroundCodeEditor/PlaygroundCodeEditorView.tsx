import { Prompt } from '../Prompt'

import { Console } from '../Console'
import { CodeEditor } from '../CodeEditor'
import type { CodeEditorRef } from '../CodeEditor/types'
import type { ConsoleRef } from '../Console/types'
import type { PromptRef } from '../Prompt/types'

type PlaygroundCodeProps = {
  code: string
  height: number
  isRunnable?: boolean
  codeEditorRef: React.RefObject<CodeEditorRef>
  consoleRef: React.RefObject<ConsoleRef>
  promptRef: React.RefObject<PromptRef>
  outputs: string[]
  onCodeChange: (code: string) => void
  onPromptConfirm: () => void
  onPromptCancel: () => void
}

export const PlaygroundCodeEditorView = ({
  code,
  height,
  isRunnable = false,
  codeEditorRef,
  consoleRef,
  promptRef,
  outputs,
  onCodeChange,
  onPromptConfirm,
  onPromptCancel,
}: PlaygroundCodeProps) => {
  return (
    <>
      <div className='relative h-full w-full border-2 border-gray-700 pt-2'>
        <CodeEditor
          ref={codeEditorRef}
          width='100%'
          height={height}
          value={code}
          isReadOnly={!isRunnable}
          onChange={onCodeChange}
        />

        {isRunnable && <Console ref={consoleRef} outputs={outputs} height={height} />}
      </div>
      {isRunnable && (
        <div className='hidden'>
          <Prompt ref={promptRef} onConfirm={onPromptConfirm} onCancel={onPromptCancel} />
        </div>
      )}
    </>
  )
}
