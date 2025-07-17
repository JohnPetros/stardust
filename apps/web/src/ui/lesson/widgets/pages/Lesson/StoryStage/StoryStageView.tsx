import type { Story } from '@stardust/core/lesson/structures'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Title } from './Title'
import { StoryChunk } from './StoryChunk'

type Props = {
  title: string
  number: number
  story: Story
  buttonHasFocus: boolean
  onQuizStageButtonClick: () => void
  onContinueButtonClick: () => void
}

export const StoryStageView = ({
  title,
  number,
  story,
  buttonHasFocus,
  onQuizStageButtonClick,
  onContinueButtonClick,
}: Props) => {
  return (
    <div id='story' className='mt-20'>
      <div className='mx-auto max-w-3xl'>
        <div className='mt-6'>
          <Title number={number}>{title}</Title>
        </div>

        <div className='mt-10 space-y-10 px-6 pb-[360px] md:px-0'>
          {story.readChunks.map((chunk, index) => {
            const shouldMemoized = index < story.currentChunkIndex.value - 2
            const hasAnimation = index === story.currentChunkIndex.value - 1
            return (
              <StoryChunk
                key={chunk}
                value={chunk}
                hasAnimation={hasAnimation}
                shouldMemoized={shouldMemoized}
              />
            )
          })}
        </div>
      </div>

      <footer className='fixed bottom-0 z-50 flex w-full items-center justify-center border-t border-gray-800 bg-gray-900 p-4'>
        {!story.hasNextTextBlock ? (
          <AlertDialog
            type='asking'
            title='Parabéns! Agora você pode ir para a próxima etapa 🚀'
            body={null}
            action={
              <Button tabIndex={-1} onClick={onQuizStageButtonClick}>
                Bora!
              </Button>
            }
          >
            <Button
              className='w-32'
              tabIndex={0}
              onClick={onContinueButtonClick}
              autoFocus
              onFocus={() => (buttonHasFocus = true)}
              onBlur={() => (buttonHasFocus = false)}
            >
              Continuar
            </Button>
          </AlertDialog>
        ) : (
          <Button
            className='w-32'
            tabIndex={0}
            onClick={onContinueButtonClick}
            autoFocus
            onFocus={() => (buttonHasFocus = true)}
            onBlur={() => (buttonHasFocus = false)}
            disabled={!story.hasNextTextBlock}
          >
            Continuar
          </Button>
        )}
      </footer>
    </div>
  )
}
