import Link from 'next/link'

import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'

import { ROUTES } from '@/constants'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { Button } from '@/ui/global/widgets/components/Button'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import { TextEditor } from '../../components/TextEditor'

type Props = {
  savedSolutionDto: SolutionDto | null
  challengeSlug: string
  solutionTitle: string
  solutionContent: string
  isActionDisable: boolean
  canExecute: boolean
  isFailure: boolean
  isSuccess: boolean
  isExecuting: boolean
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onSolutionPost: () => Promise<void>
  onSolutionEdit: () => Promise<void>
}

export const SolutionPageView = ({
  savedSolutionDto,
  challengeSlug,
  solutionTitle,
  solutionContent,
  isActionDisable,
  canExecute,
  isFailure,
  isSuccess,
  isExecuting,
  onTitleChange,
  onContentChange,
  onSolutionPost,
  onSolutionEdit,
}: Props) => {
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: savedSolutionDto ? 'atualizar?' : 'postar?',
    executing: savedSolutionDto ? 'atualizando...' : 'postando...',
    default: savedSolutionDto ? 'atualizar' : 'postar',
    success: savedSolutionDto ? 'atualizado' : 'postado',
    failure: 'erro',
  }

  return (
    <div className='max-w-6xl mx-auto h-screen bg-gray-800'>
      <header className='grid grid-cols-2 px-6 py-12'>
        <TitleInput
          value={solutionTitle}
          onChange={onTitleChange}
          placeholder='Escreva um título para a sua solução'
          className='bg-gray-800 text-gray-50'
        />
        <div className='flex items-center justify-end gap-3'>
          <Button asChild className='bg-gray-600 text-gray-50 w-24'>
            <Link
              href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
            >
              Voltar
            </Link>
          </Button>
          <ActionButton
            type='button'
            titles={ACTION_BUTTON_TITLES}
            isExecuting={isExecuting}
            canExecute={canExecute}
            isSuccess={isSuccess}
            isFailure={isFailure}
            isDisabled={isActionDisable}
            onExecute={savedSolutionDto ? onSolutionEdit : onSolutionPost}
            icon='send'
            className='w-28'
          />
        </div>
      </header>

      <main className='h-full mt-3 bg-gray-800 border-t border-gray-600'>
        <TextEditor content={solutionContent} onChange={onContentChange} />
      </main>
    </div>
  )
}
