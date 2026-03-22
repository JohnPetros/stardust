import { AlertTriangle, ArrowDown, ArrowUp, FileText, RefreshCcw } from 'lucide-react'

import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types/ActionButtonTitles'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { Button } from '@/ui/shadcn/components/button'
import { Header } from './Header'
import { TextBlocks } from './TextBlocks'
import type { useLessonStoryPage } from './useLessonStoryPage'

const ACTION_BUTTON_TITLES: ActionButtonTitles = {
  canExecute: 'salvar?',
  executing: 'salvando...',
  default: 'salvar',
  success: 'salvo',
  failure: 'erro',
}

type Props = ReturnType<typeof useLessonStoryPage>

export const LessonStoryPageView = ({
  textBlocks,
  textBlocksScrollRef,
  previewScrollRef,
  expandedBlockId,
  sortableItems,
  previewContent,
  isLoading,
  isBlocked,
  blockingReason,
  isEmpty,
  isSaveDisabled,
  errorMessage,
  onRetry,
  onAddBlock,
  onExpandBlock,
  onRemoveBlock,
  onContentChange,
  onPictureChange,
  onRunnableChange,
  onReorder,
  onSave,
  onTextBlocksScrollToTop,
  onTextBlocksScrollToBottom,
  onPreviewScrollToTop,
  onPreviewScrollToBottom,
}: Props) => {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100'>
      <div className='mx-auto flex flex-col gap-2 px-6'>
        <Header>
          <ActionButton
            type='button'
            titles={ACTION_BUTTON_TITLES}
            isDisabled={isSaveDisabled}
            onExecute={onSave}
            icon='edition'
            className='w-28'
          />
        </Header>

        {isLoading ? (
          <div className='grid min-h-[60vh] place-content-center gap-4 text-center'>
            <Loading />
            <p className='text-sm text-zinc-400'>Carregando blocos da história...</p>
          </div>
        ) : errorMessage ? (
          <div className='grid min-h-[60vh] place-content-center gap-4 rounded-2xl border border-red-900/60 bg-red-950/20 p-8 text-center'>
            <AlertTriangle className='mx-auto h-10 w-10 text-red-400' />
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold'>Não foi possível carregar a aba</h2>
              <p className='max-w-xl text-sm text-zinc-300'>{errorMessage}</p>
            </div>
            <Button type='button' variant='outline' onClick={onRetry} className='mx-auto'>
              <RefreshCcw className='mr-2 h-4 w-4' />
              Tentar novamente
            </Button>
          </div>
        ) : isBlocked ? (
          <div className='grid min-h-[60vh] place-content-center gap-4 rounded-2xl border border-amber-700/40 bg-amber-950/20 p-8 text-center'>
            <AlertTriangle className='mx-auto h-10 w-10 text-amber-400' />
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold'>Edição bloqueada</h2>
              <p className='max-w-2xl text-sm text-zinc-300'>{blockingReason}</p>
            </div>
          </div>
        ) : (
          <div className='grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]'>
            <section className='rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5'>
              <div className='mb-3 flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={onTextBlocksScrollToTop}
                >
                  <ArrowUp className='mr-1 h-4 w-4' />
                  Topo
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={onTextBlocksScrollToBottom}
                >
                  <ArrowDown className='mr-1 h-4 w-4' />
                  Fim
                </Button>
              </div>
              <div ref={textBlocksScrollRef} className='h-[75vh] overflow-y-auto pr-2'>
                <TextBlocks
                  textBlocks={textBlocks}
                  expandedBlockId={expandedBlockId}
                  sortableItems={sortableItems}
                  onAddBlock={onAddBlock}
                  onExpandBlock={onExpandBlock}
                  onRemoveBlock={onRemoveBlock}
                  onContentChange={onContentChange}
                  onPictureChange={onPictureChange}
                  onRunnableChange={onRunnableChange}
                  onReorder={onReorder}
                />
              </div>
            </section>

            <section className='rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h2 className='text-lg font-semibold'>Preview</h2>
                  <p className='text-sm text-zinc-400'>
                    Atualização local imediata, sem salvar.
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={onPreviewScrollToTop}
                  >
                    <ArrowUp className='mr-1 h-4 w-4' />
                    Topo
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={onPreviewScrollToBottom}
                  >
                    <ArrowDown className='mr-1 h-4 w-4' />
                    Fim
                  </Button>
                </div>
              </div>

              {isEmpty ? (
                <div className='grid min-h-[60vh] place-content-center gap-4 text-center'>
                  <FileText className='mx-auto h-10 w-10 text-zinc-600' />
                  <div className='space-y-1'>
                    <h3 className='text-lg font-medium'>Nenhum bloco criado</h3>
                    <p className='text-sm text-zinc-400'>
                      Adicione um tipo de bloco para iniciar a narrativa.
                    </p>
                  </div>
                </div>
              ) : previewContent ? (
                <div ref={previewScrollRef} className='max-h-[70vh] overflow-y-auto pr-2'>
                  <Mdx className='w-full space-y-24'>{previewContent}</Mdx>
                </div>
              ) : (
                <div className='grid min-h-[60vh] place-content-center text-center text-sm text-zinc-500'>
                  O preview aparecerá aqui conforme você editar os blocos.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
