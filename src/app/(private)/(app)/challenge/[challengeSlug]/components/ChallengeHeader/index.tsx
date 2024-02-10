'use client'

import { AlignLeft, AlignRight, ArrowLeft, Layout } from '@phosphor-icons/react'

import { useChallengeHeader } from './useChallengeHeader'

import type { Challenge } from '@/@types/Challenge'
import type { Vote } from '@/@types/Vote'
import { Alert } from '@/global/components/Alert'
import { Button } from '@/global/components/Button'
import { PopoverMenu, PopoverMenuButton } from '@/global/components/PopoverMenu'

type HeaderProps = {
  challenge: Challenge
  userVote: Vote
}

export function ChallengeHeader({ challenge, userVote }: HeaderProps) {
  const { handleBackButton, handleLayoutButton, layout } = useChallengeHeader(
    challenge,
    userVote
  )

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      label:
        'Tabs do lado esquerdo e editor de código do lado direito (layout padrão)',
      icon: <AlignLeft className="text-xl text-green-500" />,
      isToggle: true,
      value: layout === 'tabs-left;code_editor-right',
      action: () => handleLayoutButton('tabs-left;code_editor-right'),
    },
    {
      label: 'Tabs do lado direito e editor de código do lado esquerdo',
      icon: <AlignRight className="text-xl text-green-500" />,
      isToggle: true,
      value: layout === 'tabs-right;code_editor-left',
      action: () => handleLayoutButton('tabs-right;code_editor-left'),
    },
  ]

  return (
    <header className="flex h-12 flex-col justify-center md:border-b md:border-green-700">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3 py-3">
          <Alert
            type="crying"
            title="Você está saindo do desafio!"
            body={
              <div className="text-center">
                <p className="text-gray-300">
                  Você tem certeza que deseja sair do desafio?
                </p>
                <p className="text-red-700">
                  Todo o seu progresso será perdido!
                </p>
              </div>
            }
            action={
              <Button
                onClick={handleBackButton}
                className="bg-red-700 text-gray-100"
              >
                Sair
              </Button>
            }
            cancel={
              <Button autoFocus className="bg-green-400 text-gray-900">
                Ficar
              </Button>
            }
            canPlaySong={false}
          >
            <button className="translate-y-1">
              <ArrowLeft className="text-xl text-green-400" weight="bold" />
            </button>
          </Alert>
          <h2 className="text-lg font-semibold text-gray-100">
            {challenge.title}
          </h2>
        </div>
        <div className="hidden md:block">
          <PopoverMenu label="escolha de layout" buttons={popoverMenuButtons}>
            <button className="translate-x-2 p-2">
              <Layout className="text-lg text-green-400" weight="bold" />
            </button>
          </PopoverMenu>
        </div>
      </div>
    </header>
  )
}
