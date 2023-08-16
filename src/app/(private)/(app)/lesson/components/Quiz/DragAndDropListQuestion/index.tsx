'use client'
import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'


import { QuestionTitle } from '../QuestionTitle'
import { Item } from './Item'

import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'

import { questionAnimations, questionTransition } from '..'
import { AnimatePresence, motion } from 'framer-motion'

import { compareArrays } from '@/utils/functions'
import { DragAndDropList, SortableItem } from '@/types/quiz'

interface DragAndDropListQuestionProps {
  data: DragAndDropList
  isCurrentQuestion: boolean
}

export function DragAndDropListQuestion({
  data: { title, items, picture },
  isCurrentQuestion,
}: DragAndDropListQuestionProps) {
  const {
    state: { isAnswerVerified, currentQuestionIndex },
    dispatch,
  } = useLesson()

  const [sortableItems, setSortableItems] = useState<SortableItem[]>([])
  const [activeItemId, setActiveEventId] = useState<number | null>(null)

  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  function isUserAnswerCorrect() {
    const correctItemsIdsSequence = items.map((item) => item.id)

    const userItemsIdSequence = sortableItems.map((item) => item.id)
    return compareArrays(userItemsIdSequence, correctItemsIdsSequence)
  }

  function setIsAnswerVerified(isAnswerVerified: boolean) {
    dispatch({ type: 'setIsAnswerVerified', payload: isAnswerVerified })
  }

  function setIsAnswerCorrect(isAnswerCorrect: boolean) {
    dispatch({ type: 'setIsAnswerCorrect', payload: isAnswerCorrect })
  }

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    if (isUserAnswerCorrect()) {
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

  function handleDragEnd(event: DragEndEvent) {
    setActiveEventId(null)

    const { active, over } = event

    if (over && active.id !== over?.id) {
      setSortableItems((sortableItems) => {
        const overIndex = sortableItems.findIndex(
          (item) => item.id === active.id
        )
        const activeIndex = sortableItems.findIndex(
          (item) => item.id === over.id
        )
        return arrayMove(sortableItems, overIndex, activeIndex)
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveEventId(Number(event.active.id))
  }

  function handleDragCancel() {
    setActiveEventId(null)
  }

  useEffect(() => {
    dispatch({
      type: 'setIsAnswered',
      payload: true,
    })

    setSortableItems(items)
  }, [currentQuestionIndex])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, sortableItems])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <AnimatePresence>
        <motion.div
          key={currentQuestionIndex}
          variants={questionAnimations}
          initial="right"
          animate={isCurrentQuestion ? 'middle' : ''}
          exit="left"
          transition={questionTransition}
          className="mx-auto mt-4 w-full max-w-xl flex flex-col items-center justify-center px-6"
        >
          <QuestionTitle picture={picture}>{title}</QuestionTitle>

          <SortableContext
            items={sortableItems}
            strategy={verticalListSortingStrategy}
          >
            <div className="mx-auto w-full space-y-2 mt-8">
              {sortableItems.map((item) => (
                <Item
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  isActive={activeItemId === item.id}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItemId ? (
              <Item
                id={activeItemId}
                label={
                  sortableItems.find((item) => item.id === activeItemId)
                    ?.label ?? ''
                }
                isActive={true}
              />
            ) : null}
          </DragOverlay>
        </motion.div>
      </AnimatePresence>
    </DndContext>
  )
}
