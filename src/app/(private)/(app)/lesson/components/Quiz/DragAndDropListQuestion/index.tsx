'use client'
import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { QuestionTitle } from '../QuestionTitle'

import { SortableItem } from './SortableItem'

import type {
  DragAndDropListQuestion as DragAndDropListQuestionData,
  SortableItem as SortableItemData,
} from '@/@types/quiz'
import { useLessonStore } from '@/stores/lessonStore'
import { compareArrays, reorderItems } from '@/utils/helpers'

interface DragAndDropListQuestionProps {
  data: DragAndDropListQuestionData
}

export function DragAndDropListQuestion({
  data: { title, items, picture },
}: DragAndDropListQuestionProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect, currentQuestionIndex },
    actions: {
      setIsAnswered,
      setIsAnswerVerified,
      setIsAnswerCorrect,
      setAnswerHandler,
      changeQuestion,
      incrementIncorrectAswersAmount,
      decrementLivesAmount,
    },
  } = useLessonStore()

  const [sortableItems, setSortableItems] = useState<SortableItemData[]>([])
  const [activeSortableItemId, setActiveSortableItemId] = useState<
    number | null
  >(null)

  const hasAlreadyIncrementIncorrectAnswersAmount = useRef(false)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  function isUserAnswerCorrect() {
    const correctDragItemsIdsSequence = items.map((item) => item.id)

    const userItemsIdSequence = sortableItems.map((item) => item.id)
    return compareArrays(userItemsIdSequence, correctDragItemsIdsSequence)
  }

  function handleAnswer() {
    setIsAnswerVerified(!isAnswerVerified)

    if (isUserAnswerCorrect()) {
      setIsAnswerCorrect(true)

      if (isAnswerVerified) {
        changeQuestion()
      }

      return
    }

    setIsAnswerCorrect(false)

    if (
      isAnswerVerified &&
      !hasAlreadyIncrementIncorrectAnswersAmount.current
    ) {
      incrementIncorrectAswersAmount()
      hasAlreadyIncrementIncorrectAnswersAmount.current = true
    }

    if (isAnswerVerified) decrementLivesAmount()
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
    setIsAnswered(true)

    if (!sortableItems.length) {
      const reorderedSortableItems = reorderItems<SortableItemData>(items)
      setSortableItems(reorderedSortableItems)
    }
  }, [currentQuestionIndex])

  useEffect(() => {
    setAnswerHandler(handleAnswer)
  }, [isAnswerVerified, sortableItems])

  return (
    <>
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
          <div className="mx-auto mt-6 w-full space-y-2">
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
    </>
  )
}
