'use client'

import { ShareNetwork } from '@phosphor-icons/react'

import { SharePlaygroundDialog } from '../../../components/SharePlaygroundDialog'

import { PlaygroundHeader } from './PlaygroundHeader'
import { usePlaygroundLayout } from './usePlaygroundLayout'

import { Button } from '@/global/components/Button'
import { CodeEditorPlayground } from '@/global/components/CodeEditorPlayground'
import { CodeEditorToolbar } from '@/global/components/CodeEditorToolbar'
import { SaveButton } from '@/global/components/SaveButton'
import { Switch } from '@/global/components/Switch'

const HEADER_HEIGHT = 48
const SAVE_BUTTON_CONTAINER_HEIGHT = 64
const PADDING_BOTTOM = 24

type PlaygroundLayoutProps = {
  playgroundId: string
  playgroundTitle: string
  playgroundCode: string
  isPlaygroundPublic: boolean
  playgroundUser: { slug: string; avatarId: string } | null
}

export function PlaygroundLayout({
  playgroundId,
  playgroundTitle,
  playgroundCode,
  isPlaygroundPublic,
}: PlaygroundLayoutProps) {
  const {
    layhoutHeight,
    codeEditorPlaygroudRef,
    previousUserCode,
    isPublic,
    handleSave,
    handleRunCode,
    handleCodeChange,
    handlePlaygroundSwitch,
  } = usePlaygroundLayout(playgroundId, isPlaygroundPublic)

  const editorHeight =
    layhoutHeight -
    HEADER_HEIGHT -
    SAVE_BUTTON_CONTAINER_HEIGHT -
    PADDING_BOTTOM

  return (
    <div className="flex flex-col">
      <PlaygroundHeader
        height={HEADER_HEIGHT}
        playgroundId={playgroundId}
        playgroundTitle={playgroundTitle}
      />
      <div
        style={{ height: SAVE_BUTTON_CONTAINER_HEIGHT }}
        className="flex items-center justify-end gap-3 px-6"
      >
        {isPublic && (
          <SharePlaygroundDialog playgroundId={playgroundId}>
            <Button className="flex h-8 w-max items-center gap-2 px-3 text-xs">
              <ShareNetwork className="text-gray-900" weight="bold" />
              Compatilhar playground
            </Button>
          </SharePlaygroundDialog>
        )}
        <Switch
          label="Público"
          name="is-public"
          value="public"
          defaultCheck={isPublic}
          onCheck={handlePlaygroundSwitch}
        />
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
              code={playgroundCode}
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
