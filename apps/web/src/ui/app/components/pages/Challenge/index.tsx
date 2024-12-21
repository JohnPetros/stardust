'use client'

import { AlignLeft, AlignRight, ArrowLeft, Layout } from '@phosphor-icons/react'

import type { ChallengeDTO } from '@/@core/dtos'

import type { PopoverMenuButton } from '@/ui/global/components/shared/PopoverMenu/types'
import { PopoverMenu } from '@/ui/global/components/shared/PopoverMenu'
import { AlertDialog } from '@/ui/global/components/shared/AlertDialog'
import { Button } from '@/ui/global/components/shared/Button'
import { useChallengePage } from './useChallengePage'

type ChallengePageProps = {
  challengeDTO: ChallengeDTO
}

export function ChallengePage({ challengeDTO }: ChallengePageProps) {
  const { challenge, panelsLayout, handleBackButton, handlePanelsLayoutButton } =
    useChallengePage(challengeDTO)

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      label: 'Tabs do lado esquerdo e editor de código do lado direito (layout padrão)',
      icon: <AlignLeft className='text-xl text-green-500' />,
      isToggle: true,
      value: panelsLayout === 'tabs-left;code_editor-right',
      action: () => handlePanelsLayoutButton('tabs-left;code_editor-right'),
    },
    {
      label: 'Tabs do lado direito e editor de código do lado esquerdo',
      icon: <AlignRight className='text-xl text-green-500' />,
      isToggle: true,
      value: panelsLayout === 'tabs-right;code_editor-left',
      action: () => handlePanelsLayoutButton('tabs-right;code_editor-left'),
    },
  ]

  return (
    <header className='flex h-12 flex-col justify-center md:border-b md:border-green-700'>
      <div className='flex items-center justify-between px-6'>
        <div className='flex items-center gap-3 py-3'>
          <AlertDialog
            type='crying'
            title='Você está saindo do desafio!'
            body={
              <div className='text-center'>
                <p className='text-gray-300'>
                  Você tem certeza que deseja sair do desafio?
                </p>
                <p className='text-red-700'>Todo o seu progresso será perdido!</p>
              </div>
            }
            action={
              <Button onClick={handleBackButton} className='bg-red-700 text-gray-100'>
                Sair
              </Button>
            }
            cancel={
              <Button autoFocus className='bg-green-400 text-gray-900'>
                Ficar
              </Button>
            }
            shouldPlayAudio={false}
          >
            <button type='button' className='translate-y-1'>
              <ArrowLeft className='text-xl text-green-400' weight='bold' />
            </button>
          </AlertDialog>
          <h2 className='text-lg font-semibold text-gray-100'>
            {challenge?.title.value}
          </h2>
        </div>
        <div className='hidden md:block'>
          <PopoverMenu label='escolha de layout' buttons={popoverMenuButtons}>
            <button type='button' className='translate-x-2 p-2'>
              <Layout className='text-lg text-green-400' weight='bold' />
            </button>
          </PopoverMenu>
        </div>
      </div>
    </header>
  )
}
