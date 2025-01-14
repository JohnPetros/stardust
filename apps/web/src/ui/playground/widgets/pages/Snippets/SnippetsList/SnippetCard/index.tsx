'use client'

import Link from 'next/link'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Prompt } from '@/ui/global/widgets/components/Prompt'
import { Separator } from '@/ui/global/widgets/components/Separator'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useSnippetCard } from './useSnippetCard'
import { ShareSnippetDialog } from '../ShareSnippetDialog'

type SnippetCardProps = {
  id: string
  title: string
  onDelete: (deletedSnippetId: string) => void
}

export function SnippetCard({ id, title: initialTitle, onDelete }: SnippetCardProps) {
  const {
    snippetTitle,
    snippetUrl,
    promptRef,
    handleEditSnippetTitlePromptConfirm,
    handleDeleteSnippetButtonClick,
  } = useSnippetCard(id, initialTitle, onDelete)

  return (
    <>
      <div className='flex min-w-[16rem] cursor-pointer flex-col gap-3 rounded-md bg-green-900 p-4 shadow-md'>
        <Link href={snippetUrl} className='flex w-full items-center gap-2'>
          <Icon name='code' className='text-lg text-green-500' weight='bold' />
          <strong className='flex items-center gap-3 text-gray-100'>
            {snippetTitle}
          </strong>
        </Link>
        <Separator className='bg-green-700' isColumn={false} />
        <Toolbar.Container className='justify-end'>
          <AlertDialog
            type='crying'
            title='Você está preste a deletar um filho seu 😢!'
            body={
              <p className='text-center text-gray-100'>
                Você tem certeza que deseja deletar esse código da sua coleção?
              </p>
            }
            action={
              <Button
                onClick={handleDeleteSnippetButtonClick}
                className='bg-red-700 text-gray-100'
              >
                Sim, eu tenho certeza
              </Button>
            }
            cancel={<Button>Não, eu mudei de ideia</Button>}
            shouldPlayAudio={false}
          >
            <Toolbar.Button label='Deletar código' icon='trash' />
          </AlertDialog>
          <Prompt
            ref={promptRef}
            title='Digite o novo título'
            onConfirm={handleEditSnippetTitlePromptConfirm}
          >
            <Toolbar.Button label='Editar código' icon='pencil' />
          </Prompt>

          <ShareSnippetDialog snippetId={id}>
            <Toolbar.Button label='Compartilhar código' icon='share' />
          </ShareSnippetDialog>
        </Toolbar.Container>
      </div>
    </>
  )
}
