'use client'

import Link from 'next/link'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { TitleInput } from '@/ui/global/widgets/components/TitleInput'
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
    content,
    solution,
    canPostSolution,
    isLoading,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionEdit,
  } = useSolutionPage(savedSolutionDto, challengeId, challengeSlug)
  const { goBack } = useRouter()

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
          <Button onClick={goBack} className='bg-gray-600 text-gray-50 w-24'>
            Cancelar
          </Button>
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
              onClick={handleSolutionEdit}
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
        <ContentEditor
          content={content}
          errorMessage={fieldErrors.solutionContent}
          onChange={handleContentChange}
        />
      </main>
    </div>
  )
}
