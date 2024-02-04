'use client'

import { X } from '@phosphor-icons/react'
import Image from 'next/image'

import { useLessonHeader } from './useLessonHeader'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { ProgressBar } from '@/app/components/ProgressBar'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useRocket } from '@/hooks/useRocket'
import { useApi } from '@/services/api'
import { useLessonStore } from '@/stores/lessonStore'

export function LessonHeader() {
  const { user } = useAuthContext()

  const livesCount = useLessonStore((store) => store.state.livesCount)

  const { rocket } = useRocket(user?.rocket_id ?? '')
  const { getImage } = useApi()
  const rocketImage = getImage('rockets', rocket?.image ?? '')

  const { currentProgressValue, leaveLesson } = useLessonHeader()

  return (
    <header className="fixed top-0 z-10 h-12 w-full bg-gray-900 px-6 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-6">
        <Alert
          type="crying"
          title="Deseja mesmo sair da sua lição?"
          canPlaySong={false}
          body={null}
          action={
            <Button
              data-testid="alert-leave-lesson"
              className="w-32 bg-red-700 text-gray-100"
              onClick={leaveLesson}
            >
              Sair
            </Button>
          }
          cancel={
            <Button className="w-32 bg-green-400 text-green-900" autoFocus>
              Cancelar
            </Button>
          }
        >
          <button aria-label="Sair da lição">
            <X className="text-2xl text-red-700" weight="bold" tabIndex={-1} />
          </button>
        </Alert>

        <ProgressBar
          value={currentProgressValue}
          height={16}
          indicatorImage={rocketImage}
        />

        <div className="flex items-center gap-2">
          <div>
            <Image
              src="/icons/life.svg"
              width={36}
              height={36}
              alt=""
              priority
            />
          </div>
          <span className="text-lg font-bold text-red-700">{livesCount}</span>
        </div>
      </div>
    </header>
  )
}
