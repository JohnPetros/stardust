'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/app/components/Button'
import { Text } from '@/app/components/Text'
import { Star } from './Star'
import { Modal, ModalRef } from '@/app/components/Modal'
import { useLesson } from '@/hooks/useLesson'

import type { Text as TextData } from '@/types/text'

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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mt-6">
            <Star number={number} />
            <h1 className="uppercase text-xl text-gray-100 font-bold">
              {title}
            </h1>
          </div>
          <div className="space-y-10 mt-10 pb-[360px] px-6 md:px-0">
            {texts.map((text, index) => (
              <Text key={`text-${index}`} data={text} hasAnimation={text.hasAnimation} />
            ))}
          </div>
        </div>

        <footer className="fixed w-full bottom-0 border-t border-gray-800 bg-gray-900 flex items-center justify-center p-4">
          <Button
            className="w-32"
            tabIndex={0}
            onClick={handleContinueButtonClick}
            autoFocus
            onFocus={() => buttonHasFocus.current = true}
            onBlur={() => buttonHasFocus.current = false}
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
