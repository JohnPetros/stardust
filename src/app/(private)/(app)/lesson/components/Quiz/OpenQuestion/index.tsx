'use client'

import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { QuestionTitle } from '../QuestionTitle'
import { Input } from './Input'

import { questionAnimations, questionTransition } from '..'
import { AnimatePresence, motion } from 'framer-motion'

import type { OpenQuestion as OpenQuestionData } from '@/types/quiz'

interface OpenQuestion {
  data: OpenQuestionData
  isCurrentQuestion: boolean
}

export function OpenQuestion({
  data: { title, picture, code, answer },
  isCurrentQuestion,
}: OpenQuestion) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
    dispatch,
  } = useLesson()
  const [userAnswer, setUserAnswer] = useState('')
  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }
  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    setIsAnswerCorrect(false)

    const openQuestionAnswer = !Array.isArray(answer) ? [answer] : answer

    if (openQuestionAnswer.includes(userAnswer.trim().toLowerCase())) {
      setIsAnswerCorrect(true)

      if (isAnswerVerified) {
        dispatch({ type: 'changeQuestion' })
      }

      return
    }

    setIsAnswerCorrect(false)

    if (
      isAnswerVerified &&
      !hasAlreadyIncrementIncorrectAnswersAmount.current
    ) {
      dispatch({ type: 'incrementIncorrectAswersAmount' })
      hasAlreadyIncrementIncorrectAnswersAmount.current = true
    }

    if (isAnswerVerified) dispatch({ type: 'decrementLivesAmount' })
  }

  useEffect(() => {
    dispatch({ type: 'setIsAnswered', payload: !!userAnswer })
  }, [userAnswer])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, userAnswer])

  return (
    <AnimatePresence>
      <motion.div
        key={currentQuestionIndex}
        variants={questionAnimations}
        initial="right"
        animate={isCurrentQuestion ? 'middle' : ''}
        exit="left"
        transition={questionTransition}
        className="mx-auto mt-4 w-full max-w-xl flex flex-col items-center justify-center"
      >
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <div className="mt-8">
          <Input
            value={userAnswer}
            isAnswerCorrect={isAnswerCorrect}
            isAnswerVerified={isAnswerVerified}
            autoCapitalize="none"
            onChange={({ currentTarget }) => setUserAnswer(currentTarget.value)}
            autoFocus
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
