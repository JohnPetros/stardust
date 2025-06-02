'use client'

import { DragAndDropQuestion as DragAndDropQuestionEntity } from '@stardust/core/lesson/entities'
import type { DragAndDrop, QuestionCodeLine } from '@stardust/core/lesson/structures'
import { QuestionStem } from '../QuestionStem'
import { Dnd } from './Dnd'
import { DropZoneBank } from './DropZoneBank'
import { DropZoneSlot } from './DropZoneSlot'
import { getItemWidth } from './getItemWidth'
import { Item } from './Item'
import { useDragAndDropQuestion } from './useDragAndDropQuestion'

type DragAndDropQuestionProps = {
  stem: string
  picture: string
  codeLines: QuestionCodeLine[]
  dropZoneSlotsCount: number
  dropZoneSlotsIndexes: Record<string, number>
  initialDragAndDrop: DragAndDrop
}

export function DragAndDropQuestion({
  stem,
  codeLines,
  initialDragAndDrop,
  dropZoneSlotsCount,
  dropZoneSlotsIndexes,
  picture,
}: DragAndDropQuestionProps) {
  const {
    dragAndDrop,
    activeItemIndex,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDropQuestion({
    initialDragAndDrop,
    dropZoneSlotsIndexes,
    dropZoneSlotsCount,
    codeLines,
  })
  const activeItem = activeItemIndex ? dragAndDrop.getItemByIndex(activeItemIndex) : null

  return (
    <Dnd
      activeItem={activeItem}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <QuestionStem picture={picture}>{stem}</QuestionStem>

      <ul className='mt-3 px-6 md:w-max space-y-4 overflow-auto'>
        {codeLines.map((line) => {
          const marginLeft = 24 * line.indentation.value
          return (
            <li
              key={line.number.value}
              style={{ marginLeft }}
              className='flex items-center gap-3'
            >
              {line.texts.map((text, textIndex) => {
                const key = DragAndDropQuestionEntity.getDropZoneSlotKey(line, textIndex)
                if (!key)
                  return <span className='font-code w-max text-gray-100'>{text}</span>

                const index = dropZoneSlotsIndexes[key]
                if (!index) return
                const item = dragAndDrop.getItemByDropZone(index)
                return (
                  <div key={key}>
                    <DropZoneSlot index={index} item={item} />
                  </div>
                )
              })}
            </li>
          )
        })}
      </ul>

      <ul className='mt-3 md:mt-12 flex w-full flex-wrap justify-center gap-3'>
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
