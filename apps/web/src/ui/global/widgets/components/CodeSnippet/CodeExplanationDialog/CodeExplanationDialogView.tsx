import * as Dialog from '../../Dialog'
import { Button } from '../../Button'
import { Loading } from '../../Loading'
import { PlaygroundCodeEditor } from '../../PlaygroundCodeEditor'
import { Mdx } from '../../Mdx'

type CodeExplanationDialogViewProps = {
  isOpen: boolean
  code: string
  explanation: string
  isLoading: boolean
  codePanelHeight: number
  onRetry: () => void
  onClose: () => void
}

export const CodeExplanationDialogView = ({
  isOpen,
  code,
  explanation,
  isLoading,
  codePanelHeight,
  onRetry,
  onClose,
}: CodeExplanationDialogViewProps) => {
  return (
    <Dialog.Container
      open={isOpen}
      onOpenChange={(nextIsOpen) => !nextIsOpen && onClose()}
    >
      <Dialog.Content className='max-w-6xl'>
        <Dialog.Header>
          <div className='flex w-full items-center justify-between gap-2'>
            <span>Explicação do código</span>
            <Button
              className='h-8 w-max px-3 text-xs text-gray-800'
              isLoading={isLoading}
              onClick={onRetry}
            >
              Regerar explicação
            </Button>
          </div>
        </Dialog.Header>

        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='overflow-hidden rounded border border-gray-700'>
            <PlaygroundCodeEditor
              code={code}
              height={codePanelHeight}
              isRunnable={false}
            />
          </div>

          <div className='h-full min-h-60 rounded border border-gray-700 p-4'>
            {isLoading ? (
              <div className='grid h-full min-h-52 place-content-center'>
                <Loading />
              </div>
            ) : (
              <div className='max-h-[24rem] overflow-auto whitespace-pre-wrap text-sm text-gray-100'>
                <Mdx>{explanation}</Mdx>
              </div>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Container>
  )
}
