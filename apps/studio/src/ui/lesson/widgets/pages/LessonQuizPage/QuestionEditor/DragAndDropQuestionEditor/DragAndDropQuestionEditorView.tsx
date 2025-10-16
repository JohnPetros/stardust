import type { Image, Text } from '@stardust/core/global/structures'
import type { QuestionCodeLine } from '@stardust/core/lesson/structures'

import { Sortable } from '@/ui/global/widgets/components/Sortable'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import { QuestionHeaderInput } from '../QuestionHeaderInput'
import { CodeLineEditor } from '../CodeLineEditor'
import { DropZoneSelectView } from './DropZoneSelect/DropZoneSelectView'
import { DragAndDropItemsControl } from './DragAndDropItemsControl'

type Props = {
  stem: string
  picture: Image
  dragAndDropItems: string[]
  codeLines: SortableItem<QuestionCodeLine>[]
  correctItems: string[]
  onStemChange: (stem: Text) => void
  onPictureChange: (picture: Image) => void
  onAddCodeLineText: (lineNumber: number, textIndex: number) => void
  onAddCodeLine: () => void
  onAddCodeLineInput: (lineNumber: number, textIndex: number) => void
  onRemoveCodeLine: (lineNumber: number) => void
  onCodeLineTextChange: (lineNumber: number, text: string, textIndex: number) => void
  onCodeLineInputChange: (input: string, inputIndex: number) => void
  onCodeLineIndentationChange: (lineNumber: number, indentation: number) => void
  onRemoveCodeLineBlock: (lineNumber: number, textIndex: number) => void
  onReplaceCodeLineBlockWithText: (lineNumber: number, textIndex: number) => void
  onReplaceCodeLineBlockWithInput: (lineNumber: number, textIndex: number) => void
  onDragEnd: (newItems: SortableItem<QuestionCodeLine>[]) => void
  onAddItem: () => void
  onRemoveItem: (itemIndex: number) => void
  onItemChange: (itemIndex: number, value: string) => void
}

export const DragAndDropQuestionEditorView = ({
  stem,
  picture,
  dragAndDropItems,
  codeLines,
  correctItems,
  onStemChange,
  onPictureChange,
  onAddCodeLineText,
  onAddCodeLine,
  onAddCodeLineInput,
  onRemoveCodeLine,
  onRemoveCodeLineBlock,
  onCodeLineTextChange,
  onCodeLineInputChange,
  onCodeLineIndentationChange,
  onReplaceCodeLineBlockWithText,
  onReplaceCodeLineBlockWithInput,
  onDragEnd,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: Props) => {
  return (
    <div className='space-y-6'>
      <QuestionHeaderInput
        stem={stem}
        picture={picture}
        onPictureChange={onPictureChange}
        onStemChange={onStemChange}
      />

      <div className='space-y-6 translate-x-10'>
        <Sortable.Container
          items={codeLines}
          onDragEnd={onDragEnd}
        >
          {(items) => {
            let textIndex = -1
            return items.map((item) => {
              const line = item.value
              const blocks = line.texts.map((text) => {
                if (text === 'dropZone') {
                  textIndex++
                  const widget = (
                    <DropZoneSelectView
                      key={`${line.number.value}-${text}`}
                      items={dragAndDropItems}
                      index={textIndex}
                      correctItems={correctItems}
                      selectedItem={correctItems[textIndex]}
                      onChange={onCodeLineInputChange}
                      
                    />
                  )
                  return widget
                }
                return text
              })

              return (
                <Sortable.Item
                  key={item.index}
                  id={item.index.toString()}
                  className='-translate-x-10'
                >
                  <CodeLineEditor
                    key={line.number.toString()}
                    blocks={blocks}
                    indentation={line.indentation.value}
                    isAddInputDisabled={correctItems.length >= dragAndDropItems.length}
                    onDelete={() => onRemoveCodeLine(line.number.value)}
                    onAddCodeLineInput={(blockIndex) =>
                      onAddCodeLineInput(line.number.value, blockIndex)
                    }
                    onAddCodeLineText={(blockIndex) =>
                      onAddCodeLineText(line.number.value, blockIndex)
                    }
                    onTextChange={(text, blockIndex) =>
                      onCodeLineTextChange(line.number.value, text, blockIndex)
                    }
                    onIndentationChange={(indentation) =>
                      onCodeLineIndentationChange(line.number.value, indentation)
                    }
                    onRemoveCodeLineBlock={(blockIndex) =>
                      onRemoveCodeLineBlock(line.number.value, blockIndex)
                    }
                    onReplaceCodeLineBlockWithText={(blockIndex) =>
                      onReplaceCodeLineBlockWithText(line.number.value, blockIndex)
                    }
                    onReplaceCodeLineBlockWithInput={(blockIndex) =>
                      onReplaceCodeLineBlockWithInput(line.number.value, blockIndex)
                    }
                  />
                </Sortable.Item>
              )
            })
          } }
        </Sortable.Container>
      </div>

      <div className='w-max mx-auto'>
        <AddItemButton onClick={onAddCodeLine}>Adicionar linha de código</AddItemButton>
      </div>

      <div className='mt-12'>
        <DragAndDropItemsControl
         items={dragAndDropItems} onAddItem={onAddItem} onRemoveItem={onRemoveItem} onItemChange={onItemChange} />
      </div>
    </div>
  )
}
