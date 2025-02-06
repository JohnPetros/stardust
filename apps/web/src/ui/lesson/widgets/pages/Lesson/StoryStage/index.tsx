import { useRef } from 'react'

import { Story } from '@stardust/core/lesson/structs'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { TextBlockMdx } from './TextBlockMdx'
import { Title } from './Title'
import { useStoryStage } from './useStoryStage'
import { StoryChunk } from './StoryChunk'

type StoryStageProps = {
  title: string
  number: number
}

export function StoryStage({ title, number }: StoryStageProps) {
  const { story, handleContinueButtonClick, handleQuizStageButtonClick } = useStoryStage()
  const buttonHasFocus = useRef(false)

  if (story)
    return (
      <>
        <div id='story' className='mt-20'>
          <div className='mx-auto max-w-3xl'>
            <div className='mt-6'>
              <Title number={number}>{title}</Title>
            </div>

            <div className='mt-10 space-y-10 px-6 pb-[360px] md:px-0'>
              {story.readChunks.map((chunk, index) => {
                const shouldMemoized = index < story.currentChunkIndex.value - 2
                const hasAnimation = index === story.currentChunkIndex.value - 1
                if (typeof chunk === 'string')
                  return (
                    <StoryChunk
                      key={chunk}
                      value={chunk}
                      hasAnimation={hasAnimation}
                      shouldMemoized={shouldMemoized}
                    />
                  )
              })}

              {/* old way to render story content */}
              {story.readChunks.map((textBlock, index) => {
                const shouldMemoized = index < story.currentChunkIndex.value - 2
                const hasAnimation = index === story.currentChunkIndex.value - 1
                if (Story.isTextBlock(textBlock))
                  return (
                    <TextBlockMdx
                      key={textBlock.content}
                      content={textBlock.content}
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
                  <Button tabIndex={-1} onClick={handleQuizStageButtonClick}>
                    Bora!
                  </Button>
                }
              >
                <Button
                  className='w-32'
                  tabIndex={0}
                  onClick={handleContinueButtonClick}
                  autoFocus
                  onFocus={() => (buttonHasFocus.current = true)}
                  onBlur={() => (buttonHasFocus.current = false)}
                >
                  Continuar
                </Button>
              </AlertDialog>
            ) : (
              <Button
                className='w-32'
                tabIndex={0}
                onClick={handleContinueButtonClick}
                autoFocus
                onFocus={() => (buttonHasFocus.current = true)}
                onBlur={() => (buttonHasFocus.current = false)}
                disabled={!story.hasNextTextBlock}
              >
                Continuar
              </Button>
            )}
          </footer>
        </div>
      </>
    )
}
