import type { ReactNode } from 'react'

import type { Doc } from '@stardust/core/documentation/entities'

import { Button } from '../../Button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../../Dialog'
import { Loading } from '../../Loading'
import { Mdx } from '../../Mdx'
import { Icon } from '../../Icon'

type Props = {
  children: ReactNode
  isLoading: boolean
  content: string
  docs: Doc[]
  onDialogOpen: (isOpen: boolean) => void
  onDocButtonClick: (docId: string) => void
  onBackButtonClick: () => void
}

export const DocsDialogView = ({
  children,
  isLoading,
  content,
  docs,
  onDialogOpen,
  onDocButtonClick,
  onBackButtonClick,
}: Props) => {
  return (
    <Dialog onOpenChange={onDialogOpen}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>Documentação</DialogHeader>
        <div className='mt-6 max-h-[32rem] overflow-auto'>
          {content ? (
            <div>
              <button
                type='button'
                className='flex items-center gap-2 p-2 text-gray-100'
                onClick={onBackButtonClick}
              >
                <Icon
                  name='arrow-left'
                  className='-translate-x-2 text-xl text-gray-100'
                  weight='bold'
                />
                Voltar
              </button>
              <div className='-mt-6 space-y-24'>
                <Mdx>{content}</Mdx>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className='grid h-full w-full place-content-center'>
                  <Loading />
                </div>
              ) : (
                <div className='grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3'>
                  {docs?.map((doc) => {
                    if (doc)
                      return (
                        <div
                          key={doc.id.value}
                          className='w-full max-w-[12rem] cursor-not-allowed'
                        >
                          <Button
                            onClick={() => onDocButtonClick(doc.id.value)}
                            className='text-sm text-gray-100 bg-gray-600'
                          >
                            <div className='flex w-full items-center px-4'>
                              <p className='flex-1'>{doc.title.value}</p>
                            </div>
                          </Button>
                        </div>
                      )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
