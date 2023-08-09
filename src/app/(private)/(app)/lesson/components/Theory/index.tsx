'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/app/components/Button'
import { Text } from '@/app/components/Text'
import { Star } from './Star'

import { texts as allTexts } from '@/utils/templates/planets/planet1/star1/texts'

import type { Text as TextData } from '@/types/text'
import { Modal, ModalRef } from '@/app/components/Modal'
import { useLesson } from '@/hooks/useLesson'

interface TheoryProps {
  title: string
  number: number
}

export function Theory({ title, number }: TheoryProps) {
  const { state, dispatch } = useLesson()
  const [texts, setTexts] = useState<TextData[]>([])
  const modalRef = useRef<ModalRef>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nextTextIndex = useRef(0)

  function nextText() {
    if (nextTextIndex.current >= allTexts.length) {
      modalRef.current?.open()
      return
    }

    if (!allTexts[nextTextIndex.current]) return

    nextTextIndex.current = nextTextIndex.current + 1

    setTexts(() => {
      const previousTexts = texts.map((text) => ({
        ...text,
        hasAnimation: false,
      }))

      const nextText = {
        ...allTexts[nextTextIndex.current],
        hasAnimation: true,
      }

      return [...previousTexts, nextText]
    })

    dispatch({ type: 'incrementRenderedTextsAmount' })
  }

  function handleContinueButtonClick() {
    nextText()
  }

  function handleKeyDown({ key }: KeyboardEvent) {
    if (key === 'Enter') {
      nextText()
    }
  }

  useEffect(() => {
    setTexts([{ ...allTexts[0], hasAnimation: false }])
    dispatch({ type: 'incrementRenderedTextsAmount' })
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <div className="mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mt-6">
            <Star number={number} />
            <h1 className="uppercase text-xl text-gray-100 font-bold">
              {title}
            </h1>
          </div>
          <div className="space-y-10 mt-10 pb-[360px]">
            {texts.map((text) => (
              <Text data={text} hasAnimation={text.hasAnimation} />
            ))}
          </div>
        </div>

        <footer className="fixed w-full bottom-0 border-t border-gray-800 bg-gray-900 flex items-center justify-center p-4">
          <Button
            className="w-32"
            tabIndex={0}
            onClick={handleContinueButtonClick}
            disabled={nextTextIndex.current > allTexts.length}
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
