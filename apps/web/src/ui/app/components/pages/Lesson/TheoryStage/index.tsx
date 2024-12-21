import { useRef } from 'react'

import { AlertDialog } from '@/ui/global/components/shared/AlertDialog'
import { Button } from '@/ui/global/components/shared/Button'
import { TextBlockMdx } from './TextBlockMdx'
import { Title } from './Title'
import { useTheoryStage } from './useTheoryStage'

type TheoryStageProps = {
  title: string
  number: number
}

export function TheoryStage({ title, number }: TheoryStageProps) {
  const { theory, mdxTemplates, handleContinueButtonClick, handleQuizStageButtonClick } =
    useTheoryStage()
  const buttonHasFocus = useRef(false)

  if (theory && mdxTemplates.length)
    return (
      <>
        <div id='theory' className='mt-20'>
          <div className='mx-auto max-w-3xl'>
            <div className='mt-6'>
              <Title number={number}>{title}</Title>
            </div>

            <div className='mt-10 space-y-10 px-6 pb-[360px] md:px-0'>
              {theory.readTextBlocks.map((textBlock, index) => {
                const shouldMemoized = index < theory.currentTextBlockIndex.value - 2
                const hasAnimation = index === theory.currentTextBlockIndex.value - 1
                return (
                  <TextBlockMdx
                    key={textBlock.content}
                    content={mdxTemplates[index]}
                    hasAnimation={hasAnimation}
                    shouldMemoized={shouldMemoized}
                  />
                )
              })}
            </div>
          </div>

          <footer className='fixed bottom-0 z-50 flex w-full items-center justify-center border-t border-gray-800 bg-gray-900 p-4'>
            {!theory.hasNextTextBlock ? (
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
                disabled={!theory.hasNextTextBlock}
              >
                Continuar
              </Button>
            )}
          </footer>
        </div>
      </>
    )
}
