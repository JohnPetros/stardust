'use client'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'

import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { PopoverMenu } from '@/ui/global/widgets/components/PopoverMenu'
import { useChallengePage } from './useChallengePage'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { ConfettiAnimation } from '../../components/ConfettiAnimation'

type ChallengePagePageProps = {
  challengeDto: ChallengeDto
  userChallengeVote: ChallengeVote
}

export function ChallengePage({
  challengeDto,
  userChallengeVote,
}: ChallengePagePageProps) {
  const {
    challenge,
    panelsLayout,
    shouldHaveConfettiAnimation,
    handleBackButton,
    handlePanelsLayoutButton,
  } = useChallengePage(challengeDto, userChallengeVote)

  if (!challenge) {
    return <Loading isSmall={false} />
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      label: 'Tabs do lado esquerdo e editor de código do lado direito (layout padrão)',
      icon: <Icon name='arrow-left' size={16} className='text-xl text-green-500' />,
      isToggle: true,
      value: panelsLayout === 'tabs-left;code_editor-right',
      action: () => handlePanelsLayoutButton('tabs-left;code_editor-right'),
    },
    {
      label: 'Tabs do lado direito e editor de código do lado esquerdo',
      icon: <Icon name='arrow-right' size={16} className='text-xl text-green-500' />,
      isToggle: true,
      value: panelsLayout === 'tabs-right;code_editor-left',
      action: () => handlePanelsLayoutButton('tabs-right;code_editor-left'),
    },
  ]

  return (
    <header className='flex h-12 flex-col justify-center md:border-b md:border-green-700'>
      {shouldHaveConfettiAnimation && <ConfettiAnimation delay={3} />}
      <div className='flex items-center justify-between px-6'>
        <div className='flex items-center gap-3'>
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
            <button type='button'>
              <Icon
                name='arrow-left'
                className='text-xl text-green-400'
                weight='normal'
                size={20}
              />
            </button>
          </AlertDialog>
          <h1 className='text-lg font-semibold text-gray-100'>{challengeDto.title}</h1>
        </div>
        <div className='hidden md:block'>
          <PopoverMenu label='escolha de layout' buttons={popoverMenuButtons}>
            <div className='translate-x-2 p-2'>
              <Icon name='layout' className='text-lg text-green-400' weight='bold' />
            </div>
          </PopoverMenu>
        </div>
      </div>
    </header>
  )
}
