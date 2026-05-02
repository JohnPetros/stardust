'use client'

import type { PropsWithChildren } from 'react'

import type { LspSnippet } from '@stardust/core/global/types'

import { Button } from '@/ui/global/widgets/components/Button'
import * as Dialog from '@/ui/global/widgets/components/Dialog'

type SnippetExamplesDialogViewProps = {
  snippets: LspSnippet[]
  onSelectSnippet: (snippet: LspSnippet) => void
}

export const SnippetExamplesDialogView = ({
  children: trigger,
  snippets,
  onSelectSnippet,
}: PropsWithChildren<SnippetExamplesDialogViewProps>) => {
  return (
    <Dialog.Container>
      <Dialog.Content className='max-w-2xl'>
        <Dialog.Header>Exemplos de snippets</Dialog.Header>
        <div className='mt-6 max-h-[28rem] overflow-auto'>
          {snippets.length === 0 ? (
            <p className='text-center text-sm text-gray-300'>
              Nenhum exemplo disponivel no momento.
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              {snippets.map((snippet) => (
                <Dialog.Close key={snippet.label} asChild>
                  <Button
                    className='h-10 justify-start bg-gray-600 px-4 text-sm text-gray-100'
                    onClick={() => onSelectSnippet(snippet)}
                  >
                    {snippet.label}
                  </Button>
                </Dialog.Close>
              ))}
            </div>
          )}
        </div>
      </Dialog.Content>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
    </Dialog.Container>
  )
}
