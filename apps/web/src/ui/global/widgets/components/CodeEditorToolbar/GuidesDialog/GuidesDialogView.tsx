import type { ReactNode } from 'react'

import type { Guide } from '@stardust/core/manual/entities'

import { Button } from '../../Button'
import * as Dialog from '../../Dialog'
import { Loading } from '../../Loading'
import { Mdx } from '../../Mdx'
import { Icon } from '../../Icon'

type Props = {
  children: ReactNode
  isLoading: boolean
  content: string
  guides: Guide[]
  onDialogOpen: (isOpen: boolean) => void
  onGuideButtonClick: (guideId: string) => void
  onBackButtonClick: () => void
}

export const GuidesDialogView = ({
  children,
  isLoading,
  content,
  guides,
  onDialogOpen,
  onGuideButtonClick,
  onBackButtonClick,
}: Props) => {
  return (
    <Dialog.Container onOpenChange={onDialogOpen}>
      <Dialog.Content className='max-w-3xl'>
        <Dialog.Header>Guias</Dialog.Header>
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
            <div>
              {isLoading ? (
                <div className='grid h-full w-full place-content-center'>
                  <Loading />
                </div>
              ) : (
                <div className='grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3'>
                  {guides?.map((guide) => {
                    if (guide)
                      return (
                        <div
                          key={guide.id.value}
                          className='w-full max-w-[12rem] cursor-not-allowed'
                        >
                          <Button
                            onClick={() => onGuideButtonClick(guide.id.value)}
                            className='text-sm text-gray-100 bg-gray-600'
                          >
                            <div className='flex w-full items-center px-4'>
                              <p className='flex-1'>{guide.title.value}</p>
                            </div>
                          </Button>
                        </div>
                      )
                    return null
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog.Content>
      <Dialog.Trigger>{children}</Dialog.Trigger>
    </Dialog.Container>
  )
}
