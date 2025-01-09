'use client'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { ContentEditor } from '../../components/ContentEditor'
import { useSolutionPage } from './useSolutionPage'
import { Button } from '@/ui/global/widgets/components/Button'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'

type SolutionPageProps = {
  savedSolutionDto: SolutionDto | null
  challengeId: string
}

export function SolutionPage({ savedSolutionDto, challengeId }: SolutionPageProps) {
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
  } = useSolutionPage(savedSolutionDto, challengeId)

  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: solution ? 'atualizar?' : 'postar?',
    executing: solution ? 'atualizando...' : 'postando...',
    default: solution ? 'atualizado' : 'postar',
    success: solution ? 'atualizado' : 'postado',
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
          <Button className='bg-gray-600 text-gray-50 w-24'>Cancelar</Button>
          <ActionButton
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
