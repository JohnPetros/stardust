'use client'

import { PlaygroundHeader } from './PlaygroundHeader'
import { usePlaygroundLayout } from './usePlaygroundLayout'

import { CodeEditorPlayground } from '@/app/components/CodeEditorPlayground'
import { CodeEditorToolbar } from '@/app/components/CodeEditorToolbar'
import { SaveButton } from '@/app/components/SaveButton'

const HEADER_HEIGHT = 48
const SAVE_BUTTON_CONTAINER_HEIGHT = 64
const PADDING_BOTTOM = 24

type PlaygroundLayoutProps = {
  id: string
  title: string
  code: string
  userId: string
}

export function PlaygroundLayout({
  id,
  title,
  code,
  userId,
}: PlaygroundLayoutProps) {
  const {
    layhoutHeight,
    codeEditorPlaygroudRef,
    previousUserCode,
    handleSave,
    handleRunCode,
    handleCodeChange,
  } = usePlaygroundLayout(id)

  const editorHeight =
    layhoutHeight -
    HEADER_HEIGHT -
    SAVE_BUTTON_CONTAINER_HEIGHT -
    PADDING_BOTTOM

  return (
    <div className="flex flex-col">
      <PlaygroundHeader
        height={HEADER_HEIGHT}
        playgroundId={id}
        playgroundTitle={title}
      />
      <div
        style={{ height: SAVE_BUTTON_CONTAINER_HEIGHT }}
        className="flex items-center justify-end px-6"
      >
        <SaveButton onSave={handleSave} />
      </div>
      <div style={{ height: editorHeight }} className="overflow-hidden px-6">
        <CodeEditorToolbar
          previousUserCode={previousUserCode}
          codeEditorRef={codeEditorPlaygroudRef}
          onRunCode={handleRunCode}
        >
          <div className="-translate-y-2">
            <CodeEditorPlayground
              ref={codeEditorPlaygroudRef}
              code={code}
              height={editorHeight}
              onCodeChange={handleCodeChange}
              isRunnable={true}
            />
          </div>
        </CodeEditorToolbar>
      </div>
    </div>
  )
}
