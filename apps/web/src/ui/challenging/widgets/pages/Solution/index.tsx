'use client'

import Link from 'next/link'

import type { SolutionDto } from '@stardust/core/challenging/dtos'

import { ROUTES } from '@/constants'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { Button } from '@/ui/global/widgets/components/Button'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ContentEditor } from '../../components/ContentEditor'
import { useSolutionPage } from './useSolutionPage'

type SolutionPageProps = {
  savedSolutionDto: SolutionDto | null
  challengeId: string
  challengeSlug: string
}

export function SolutionPage({
  savedSolutionDto,
  challengeId,
  challengeSlug,
}: SolutionPageProps) {
  const {
    solutionTitle,
    fieldErrors,
    solutionContent,
    solution,
    isActionDisable,
    canExecute,
    isFailure,
    isSuccess,
    isExecuting,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionEdit,
  } = useSolutionPage(savedSolutionDto, challengeId, challengeSlug)
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
          onChange={handleTitleChange}
          placeholder='Escreva um título para a sua solução'
          className='bg-gray-800 text-gray-50'
          errorMessage={fieldErrors.solutionTitle}
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
            onExecute={solution ? handleSolutionEdit : handleSolutionPost}
            icon='send'
            className='w-28'
          />
        </div>
      </header>

      <main className='h-full mt-3 bg-gray-800 border-t border-gray-600'>
        <ContentEditor
          content={solutionContent}
          errorMessage={fieldErrors.solutionContent}
          onChange={handleContentChange}
        />
      </main>
    </div>
  )
}
