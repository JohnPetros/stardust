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
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionUpdate,
  } = useSolutionPage(savedSolutionDto, challengeId)

  return (
    <div className='bg-gray-800'>
      <header className='grid grid-cols-2'>
        <TitleInput
          value={title}
          onChange={handleTitleChange}
          placeholder='Escreva um título para a sua solução'
          errorMessage={fieldErrors?.title[0]}
        />
        <div className='flex items-end'>
          <Button className='bg-gray-300 text-gray-50 w-24'>Cancelar</Button>
          {!solution && (
            <Button
              disabled={canPostSolution}
              onClick={handleSolutionPost}
              className='bg-gray-300 text-gray-50'
            >
              <Icon name='send' size={16} className='text-gray-50' />
              Postar
            </Button>
          )}
          {solution && (
            <Button
              disabled={canPostSolution}
              onClick={handleSolutionUpdate}
              className='bg-gray-300 text-gray-50 w-24  '
            >
              <Icon name='send' size={16} className='text-gray-50' />
              Atualizar
            </Button>
          )}
        </div>
      </header>

      <ContentEditor content={content} onChange={handleContentChange} />
    </div>
  )
}
