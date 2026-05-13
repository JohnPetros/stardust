'use client'

import Image from 'next/image'
import { StorageFolder } from '@stardust/core/storage/structures'

import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { AnimatedProgressBar } from '@/ui/global/widgets/components/AnimatedProgressBar'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useLessonHeader } from './useLessonHeader'
import { NotesDrawer } from '@/ui/global/widgets/components/NotesDrawer'

type LessonHeaderProps = {
  onLeavePage: VoidFunction
}

export function LessonHeader({ onLeavePage }: LessonHeaderProps) {
  const { user } = useAuthContext()
  const { lessonProgress, livesCount } = useLessonHeader()
  const rocketImage = user
    ? useFileStorage(StorageFolder.createAsRockets(), user.rocket.image.value)
    : ''

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

          <AnimatedProgressBar
            value={lessonProgress.value}
            height={16}
            indicatorImage={rocketImage}
          />

          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center justify-center gap-1'>
              <div className='h-6 w-6 shrink-0'>
                <Image src='/icons/life.svg' width={24} height={24} alt='' priority />
              </div>
              <span className='text-xl -translate-y-0.5 font-bold text-red-700'>
                {livesCount}
              </span>
            </div>
            <div>
              <NotesDrawer>
                <div className='rounded-md p-1 text-gray-300 transition-colors hover:bg-gray-800 hover:text-gray-100'>
                  <Icon name='book' size={20} />
                </div>
              </NotesDrawer>
            </div>
          </div>
        </div>
      </header>
    )
}
