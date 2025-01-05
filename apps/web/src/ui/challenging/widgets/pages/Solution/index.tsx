'use client'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { ContentEditor } from '../../components/ContentEditor'
import { useSolutionPage } from './useSolutionPage'
import { Button } from '@/ui/global/widgets/components/Button'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'

type SolutionPageProps = {
  savedSolutionDto: SolutionDto | null
  challengeId: string
}

export function SolutionPage({ savedSolutionDto, challengeId }: SolutionPageProps) {
  const {
    title,
    content,
    solution,
    canPostSolution,
    fieldErrors,
    isLoading,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionUpdate,
  } = useSolutionPage(savedSolutionDto, challengeId)

  return (
    <div className='max-w-6xl mx-auto h-screen bg-gray-800'>
      <header className='grid grid-cols-2 px-6 py-12'>
        <TitleInput
          value={title}
          onChange={handleTitleChange}
          placeholder='Escreva um título para a sua solução'
          className='bg-gray-800 text-gray-50'
          errorMessage={fieldErrors?.title[0]}
        />
        <div className='flex items-center justify-end gap-3'>
          <Button className='bg-gray-600 text-gray-50 w-24'>Cancelar</Button>
          {!solution && (
            <Button
              disabled={!canPostSolution}
              onClick={handleSolutionPost}
              isLoading={isLoading}
              className='w-28'
            >
              <Icon name='send' size={14} className='text-green-900 mr-1' />
              Postar
            </Button>
          )}
          {solution && (
            <Button
              disabled={!canPostSolution}
              onClick={handleSolutionUpdate}
              isLoading={isLoading}
              className='w-28'
            >
              <Icon name='send' size={14} className='text-green-900 mr-1' />
              Atualizar
            </Button>
          )}
        </div>
      </header>

      <main className='h-full mt-3 bg-gray-800 border-t border-gray-600'>
        <ContentEditor content={content} onChange={handleContentChange} />
      </main>
    </div>
  )
}
