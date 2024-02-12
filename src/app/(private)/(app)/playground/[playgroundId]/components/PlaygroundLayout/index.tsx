'use client'

import { ShareNetwork } from '@phosphor-icons/react'

import { SharePlaygroundDialog } from '../../../components/SharePlaygroundDialog'

import type { PlaygroundLayoutProps } from './types/PlaygroundLayoutProps'
import { PlaygroundHeader } from './PlaygroundHeader'
import { usePlaygroundLayout } from './usePlaygroundLayout'

import { Button } from '@/global/components/Button'
import { CodeEditorPlayground } from '@/global/components/CodeEditorPlayground'
import { CodeEditorToolbar } from '@/global/components/CodeEditorToolbar'
import { ExitPageAlertDialog } from '@/global/components/ExitPageAlertDialog'
import { SaveButton } from '@/global/components/SaveButton'
import { Switch } from '@/global/components/Switch'
import { useSaveButtonStore } from '@/stores/saveButtonStore'

const HEADER_HEIGHT = 48
const SAVE_BUTTON_CONTAINER_HEIGHT = 64
const PADDING_BOTTOM = 24

export function PlaygroundLayout({
  playgroundId,
  playgroundTitle,
  playgroundCode,
  isPlaygroundPublic,
  playgroundUser,
}: PlaygroundLayoutProps) {
  const {
    layhoutHeight,
    id,
    hasPlayground,
    isPublic,
    isFromAuthUser,
    previousUserCode,
    codeEditorPlaygroudRef,
    handleSaveButton,
    handleRunCode,
    handleCodeChange,
    handlePlaygroundSwitch,
    onCreatePlayground,
  } = usePlaygroundLayout({
    playgroundId,
    isPlaygroundPublic,
    playgroundUser,
  })

  const canSave = useSaveButtonStore((store) => store.state.canSave)

  const editorHeight =
    layhoutHeight -
    HEADER_HEIGHT -
    SAVE_BUTTON_CONTAINER_HEIGHT -
    PADDING_BOTTOM

  return (
    <>
      <ExitPageAlertDialog
        shouldOpen={canSave}
        message="Você não salvou o seu playgorund ainda! Tem certeza que deseja sair?"
      />
      <div className="flex flex-col">
        <PlaygroundHeader
          height={HEADER_HEIGHT}
          playgroundId={id}
          playgroundTitle={playgroundTitle}
          hasPlayground={hasPlayground}
          onCreatePlayground={onCreatePlayground}
        />
        <div
          style={{ height: SAVE_BUTTON_CONTAINER_HEIGHT }}
          className="flex items-center justify-end gap-3 px-6"
        >
          {isFromAuthUser && isPublic && (
            <SharePlaygroundDialog playgroundId={id}>
              <Button className="flex h-8 w-max items-center gap-2 px-3 text-xs">
                <ShareNetwork className="text-gray-900" weight="bold" />
                Compatilhar playground
              </Button>
            </SharePlaygroundDialog>
          )}
          {isFromAuthUser && (
            <Switch
              label="Público"
              name="is-public"
              value="public"
              defaultCheck={isPublic}
              onCheck={handlePlaygroundSwitch}
            />
          )}
          <SaveButton onSave={handleSaveButton} />
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
    </>
  )
}
