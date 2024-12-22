'use client'

import Image from 'next/image'

import { useApi } from '@/ui/global/hooks'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useLessonHeader } from './useLessonHeader'
import { ProgressBar } from '@/ui/global/widgets/components/ProgressBar'
import { Icon } from '@/ui/global/widgets/components/Icon'

type LessonHeaderProps = {
  onLeavePage: VoidFunction
}

export function LessonHeader({ onLeavePage }: LessonHeaderProps) {
  const { user } = useAuthContext()
  const { lessonProgress, livesCount } = useLessonHeader()
  const api = useApi()
  const rocketImage = user ? api.fetchImage('rockets', user.rocket.image.value) : ''

  if (lessonProgress)
    return (
      <header className='fixed top-0 z-10 h-12 w-full bg-gray-900 px-6 py-3'>
        <div className='mx-auto flex max-w-3xl items-center justify-between gap-6'>
          <AlertDialog
            type='crying'
            title='Deseja mesmo sair da sua lição?'
            shouldPlayAudio={false}
            body={null}
            action={
              <Button
                data-testid='alertDialog-leave-lesson'
                className='w-32 bg-red-700 text-gray-100'
                onClick={onLeavePage}
              >
                Sair
              </Button>
            }
            cancel={
              <Button className='w-32 bg-green-400 text-green-900' autoFocus>
                Cancelar
              </Button>
            }
          >
            <button type='button' aria-label='Sair da lição' tabIndex={-1}>
              <Icon name='close' className='text-2xl text-red-700' weight='bold' />
            </button>
          </AlertDialog>

          <ProgressBar
            value={lessonProgress.value}
            height={16}
            indicatorImage={rocketImage}
          />

          <div className='flex items-center gap-2'>
            <div>
              <Image src='/icons/life.svg' width={36} height={36} alt='' priority />
            </div>
            <span className='text-lg font-bold text-red-700'>{livesCount}</span>
          </div>
        </div>
      </header>
    )
}
