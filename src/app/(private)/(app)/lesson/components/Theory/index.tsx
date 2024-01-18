'use client'

import { useRef } from 'react'

import { Star } from './Star'
import { useTheory } from './useTheory'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { MdxComponent } from '@/app/components/MdxComponent'
import { useLessonStore } from '@/stores/lessonStore'

type TheoryProps = {
  title: string
  number: number
  compiledMdxComponets: string[]
}

export function Theory({ title, number, compiledMdxComponets }: TheoryProps) {
  const {
    hasNextMdxComponent,
    currentMdxComponentIndex,
    mdxComponents,
    handleContinueButtonClick,
  } = useTheory(compiledMdxComponets)
  const showQuiz = useLessonStore((store) => store.actions.showQuiz)

  const buttonHasFocus = useRef(false)

  return (
    <>
      <div id="theory" className="mt-20">
        <div className="mx-auto max-w-3xl">
          {mdxComponents.length > 0 && (
            <div className="mt-6 flex items-center justify-center">
              <Star number={number} />
              <h1 className="text-xl font-bold uppercase text-gray-100">
                {title}
              </h1>
            </div>
          )}

          <div className="mt-10 space-y-10 px-6 pb-[360px] md:px-0">
            {mdxComponents.map((text, index) => {
              const shouldMemoized = index < currentMdxComponentIndex - 1
              return (
                <MdxComponent
                  key={text.content}
                  content={text.content}
                  hasAnimation={text.hasAnimation}
                  shouldMemoized={shouldMemoized}
                />
              )
            })}
          </div>
        </div>

        <footer className="fixed bottom-0 z-50 flex w-full items-center justify-center border-t border-gray-800 bg-gray-900 p-4">
          {!hasNextMdxComponent ? (
            <Alert
              type={'asking'}
              title={`Parabéns! \n Agora você pode ir para a próxima etapa 🚀`}
              body={null}
              action={
                <Button tabIndex={-1} onClick={() => showQuiz()}>
                  Bora!
                </Button>
              }
            >
              <Button
                className="w-32"
                tabIndex={0}
                onClick={handleContinueButtonClick}
                autoFocus
                onFocus={() => (buttonHasFocus.current = true)}
                onBlur={() => (buttonHasFocus.current = false)}
                disabled={!hasNextMdxComponent}
              >
                Continuar
              </Button>
            </Alert>
          ) : (
            <Button
              className="w-32"
              tabIndex={0}
              onClick={handleContinueButtonClick}
              autoFocus
              onFocus={() => (buttonHasFocus.current = true)}
              onBlur={() => (buttonHasFocus.current = false)}
              disabled={!hasNextMdxComponent}
            >
              Continuar
            </Button>
          )}
        </footer>
      </div>
    </>
  )
}
