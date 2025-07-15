import Link from 'next/link'
import type { RefObject } from 'react'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Prompt } from '@/ui/global/widgets/components/Prompt'
import { Separator } from '@/ui/global/widgets/components/Separator'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ShareSnippetDialog } from '@/ui/playground/widgets/components/ShareSnippetDialog'
import type { PromptRef } from '@/ui/global/widgets/components/Prompt/types'

type Props = {
  snippetId: string
  title: string
  snippetUrl: string
  promptRef: RefObject<PromptRef | null>
  onDeleteSnippetButtonClick: () => void
  onEditSnippetTitlePromptConfirm: () => void
}

export const SnippetCardView = ({
  snippetId,
  title,
  snippetUrl,
  promptRef,
  onDeleteSnippetButtonClick,
  onEditSnippetTitlePromptConfirm,
}: Props) => {
  return (
    <div className='flex min-w-[16rem] cursor-pointer flex-col gap-3 rounded-md bg-green-900 p-4 shadow-md'>
      <Link href={snippetUrl} className='flex w-full items-center gap-2'>
        <Icon name='code' size={18} className='text-lg text-green-500' weight='bold' />
        <strong className='flex items-center gap-3 text-gray-100 text-ellipsis truncate'>
          {title}
        </strong>
      </Link>
      <Separator className='bg-green-700' isColumn={false} />
      <Toolbar.Container className='flex justify-end gap-2'>
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
              onClick={onDeleteSnippetButtonClick}
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
          onConfirm={onEditSnippetTitlePromptConfirm}
        >
          <Toolbar.Button label='Editar código' icon='pencil' />
        </Prompt>

        <ShareSnippetDialog snippetId={snippetId}>
          <Toolbar.Button label='Compartilhar código' icon='share' />
        </ShareSnippetDialog>
      </Toolbar.Container>
    </div>
  )
}
