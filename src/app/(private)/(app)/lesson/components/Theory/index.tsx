'use client'

import { useEffect, useRef, useState } from 'react'

import { Star } from './Star'

import type { Text as TextData } from '@/@types/text'
import { Modal, ModalRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { Text } from '@/app/components/Text'
import { useLesson } from '@/hooks/useLesson'

interface TheoryProps {
  title: string
  number: number
}

export function Theory({ title, number }: TheoryProps) {
  const { state, dispatch } = useLesson()
  const [texts, setTexts] = useState<TextData[]>([])
  const modalRef = useRef<ModalRef>(null)
  const buttonHasFocus = useRef(false)
  const nextTextIndex = useRef(0)

  function nextText() {
    if (nextTextIndex.current >= state.texts.length) {
      modalRef.current?.open()
      return
    }

    if (!state.texts[nextTextIndex.current]) return

    nextTextIndex.current = nextTextIndex.current + 1

    setTexts(() => {
      const previousTexts = texts.map((text) => ({
        ...text,
        hasAnimation: false,
      }))

      const nextText = {
        ...state.texts[nextTextIndex.current],
        hasAnimation: true,
      }

      return [...previousTexts, nextText]
    })

    dispatch({ type: 'incrementRenderedTextsAmount' })
  }

  function handleContinueButtonClick() {
    nextText()
  }

  useEffect(() => {
    setTexts([{ ...state.texts[0], hasAnimation: false }])
    dispatch({ type: 'incrementRenderedTextsAmount' })
  }, [state.texts])

  return (
    <>
      <div id="theory" className="mt-20">
        <div className="mx-auto max-w-3xl">
          <div className="mt-6 flex items-center justify-center">
            <Star number={number} />
            <h1 className="text-xl font-bold uppercase text-gray-100">
              {title}
            </h1>
          </div>
          <div className="mt-10 space-y-10 px-6 pb-[360px] md:px-0">
            {texts.map((text, index) => (
              <Text
                key={`text-${index}`}
                data={text}
                hasAnimation={text.hasAnimation}
              />
            ))}
          </div>
        </div>

        <footer className="fixed bottom-0 flex w-full items-center justify-center border-t border-gray-800 bg-gray-900 p-4">
          <Button
            className="w-32"
            tabIndex={0}
            onClick={handleContinueButtonClick}
            autoFocus
            onFocus={() => (buttonHasFocus.current = true)}
            onBlur={() => (buttonHasFocus.current = false)}
            disabled={nextTextIndex.current > state.texts.length}
          >
            Continuar
          </Button>
        </footer>
      </div>

      <Modal
        ref={modalRef}
        type={'asking'}
        title={`Parabéns! \n Agora você pode ir para a próxima etapa 🚀`}
        body={null}
        footer={
          <Button tabIndex={-1} onClick={() => dispatch({ type: 'showQuiz' })}>
            Bora!
          </Button>
        }
      />
    </>
  )
}
