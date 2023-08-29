'use client'
import { useEffect, useRef, useState } from 'react'
import { useLesson } from '@/hooks/useLesson'

import { QuestionTitle } from '../QuestionTitle'
import { SortableItem } from './SortableItem'

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

import { compareArrays, reorderItems } from '@/utils/functions'

import type {
  DragAndDropListQuestion as DragAndDropListQuestionData,
  SortableItem as SortableItemData,
} from '@/types/quiz'
import { QuestionContainer } from '../QuestionContainer'

interface DragAndDropListQuestionProps {
  data: DragAndDropListQuestionData
}

export function DragAndDropListQuestion({
  data: { title, items, picture },
}: DragAndDropListQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
    dispatch,
  } = useLesson()

  const [sortableItems, setSortableItems] = useState<SortableItemData[]>([])
  const [activeSortableItemId, setActiveSortableItemId] = useState<
    number | null
  >(null)

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
    setActiveSortableItemId(null)

    const { active, over } = event

    if (over && active.id !== over?.id) {
      setSortableItems((sortableItems) => {
        const activeIndex = sortableItems.findIndex(
          (item) => item.id === active.id
        )
        const overIndex = sortableItems.findIndex((item) => item.id === over.id)
        return arrayMove(sortableItems, activeIndex, overIndex)
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveSortableItemId(Number(event.active.id))
  }

  function handleDragCancel() {
    setActiveSortableItemId(null)
  }

  useEffect(() => {
    dispatch({
      type: 'setIsAnswered',
      payload: true,
    })

    if (!sortableItems.length) {
      const reorderedSortableItems = reorderItems<SortableItemData>(items)
      setSortableItems(reorderedSortableItems)
    }
  }, [currentQuestionIndex])

  useEffect(() => {
    dispatch({
      type: 'setAnswerHandler',
      payload: handleAnswer,
    })
  }, [isAnswerVerified, sortableItems])

  return (
    <QuestionContainer>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <QuestionTitle picture={picture}>{title}</QuestionTitle>

        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="mx-auto w-full space-y-2 mt-6">
            {sortableItems.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                label={item.label}
                isAnswerCorrect={isAnswerCorrect}
                isAnswerVerified={isAnswerVerified}
                isActive={activeSortableItemId === item.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSortableItemId ? (
            <SortableItem
              id={activeSortableItemId}
              label={
                sortableItems.find((item) => item.id === activeSortableItemId)
                  ?.label ?? ''
              }
              isAnswerCorrect={isAnswerCorrect}
              isAnswerVerified={isAnswerVerified}
              isActive={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </QuestionContainer>
  )
}
