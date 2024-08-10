'use client'

import type { DragAndDrop, QuestionCodeLine } from '@/@core/domain/structs'

import { QuestionStatement } from '../QuestionStatement'
import { Dnd } from './Dnd'
import { DropZoneBank } from './DropZoneBank'
import { DropZoneSlot } from './DropZoneSlot'
import { getItemWidth } from './getItemWidth'
import { Item } from './Item'
import { useDragAndDropQuestion } from './useDragAndDropQuestion'

type DragAndDropQuestionProps = {
  statement: string
  picture: string
  correctItemIndexesSequence: number[]
  codeLines: QuestionCodeLine[]
  dropZonesCount: number
  initialDragAndDrop: DragAndDrop
}

export function DragAndDropQuestion({
  statement,
  codeLines,
  initialDragAndDrop,
  picture,
}: DragAndDropQuestionProps) {
  const {
    dragAndDrop,
    activeItemIndex,
    dropZonesCount,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDropQuestion(initialDragAndDrop)

  const activeItem = activeItemIndex ? dragAndDrop.getItemByIndex(activeItemIndex) : null

  return (
    <Dnd
      activeItem={activeItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <QuestionStatement picture={picture}>{statement}</QuestionStatement>

      <ul className='mt-6 space-y-4'>
        {codeLines.map((line) => {
          const marginLeft = 24 * line.indentation.value
          return (
            <li
              key={line.number.value}
              style={{ marginLeft }}
              className='flex items-center gap-3'
            >
              {line.texts.map((text, index) => {
                const key = `${index}-${line.number.value}`
                const isDropZone = text === 'dropZone'

                return (
                  <div key={key}>
                    {isDropZone ? (
                      <DropZoneSlot
                        index={dropZonesCount.current}
                        item={dragAndDrop.getItemByDropZone(line.number.value)}
                      />
                    ) : (
                      <span className='font-code text-gray-100'>{text}</span>
                    )}
                  </div>
                )
              })}
            </li>
          )
        })}
      </ul>

      <ul className='mt-12 flex w-full flex-wrap justify-center gap-3'>
        {dragAndDrop.items.map((item) => {
          const itemWidth = getItemWidth(item.label.value)

          return (
            <li key={item.index.value}>
              <DropZoneBank
                index={item.originalDropZoneIndex.value}
                hasItem={item.dropZoneIndex.value === item.originalDropZoneIndex.value}
                width={itemWidth}
              >
                <Item
                  index={item.index.value}
                  originalDropZoneIndex={item.originalDropZoneIndex.value}
                  label={item.label.value}
                  isActive={activeItemIndex === item.index.value}
                  width={itemWidth}
                />
              </DropZoneBank>
            </li>
          )
        })}
      </ul>
    </Dnd>
  )
}
