import type { Image, Text } from '@stardust/core/global/structures'
import type { QuestionCodeLine } from '@stardust/core/lesson/structures'

import { Sortable } from '@/ui/global/widgets/components/Sortable'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import { ExpandableInput } from '@/ui/lesson/widgets/components/ExpandableInput'
import { QuestionHeaderInput } from '../QuestionHeaderInput'
import { CodeInput } from '../CodeInput'
import { CodeLineEditor } from '../CodeLineEditor'

type Props = {
  stem: string
  picture: Image
  code?: string
  codeLines: SortableItem<QuestionCodeLine>[]
  answers: string[]
  onStemChange: (stem: Text) => void
  onPictureChange: (picture: Image) => void
  onCodeChange: (code: string) => void
  onCodeInputDisabled: () => void
  onCodeInputEnable: (defaultCode: string) => void
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
}

type WidgetProps = {
  value: string
  index: number
  onChange: (value: string, index: number) => void
}

const Widget = ({ value, index, onChange }: WidgetProps) => {
  return (
    <ExpandableInput
      defaultValue={value}
      onBlur={(value) => onChange(value, index)}
      className='bg-zinc-800 outline-none border border-zinc-700 rounded-md px-2 py-1 w-max'
    />
  )
}

export const OpenQuestionEditorView = ({
  stem,
  picture,
  code,
  codeLines,
  answers,
  onStemChange,
  onPictureChange,
  onCodeChange,
  onCodeInputDisabled,
  onCodeInputEnable,
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
}: Props) => {
  return (
    <div className='space-y-6'>
      <QuestionHeaderInput
        stem={stem}
        picture={picture}
        onPictureChange={onPictureChange}
        onStemChange={onStemChange}
      />

      <CodeInput
        value={code}
        onDisable={onCodeInputDisabled}
        onEnable={onCodeInputEnable}
        onChange={onCodeChange}
      />

      <div className='space-y-6 translate-x-10'>
        <Sortable.Container
          key={codeLines.map((item) => item.data.texts.join()).join()}
          items={codeLines}
          onDragEnd={onDragEnd}
        >
          {(items) => {
            let inputIndex = -1
            return items.map((item) => {
              const line = item.data
              const blocks = line.texts.map((text) => {
                if (text.startsWith('input')) {
                  inputIndex++
                  // const inputIndex = Number(text.split('-')[1]) - 1
                  const widget = (
                    <Widget
                      key={`${line.number.value}-${text}`}
                      value={answers[inputIndex] ?? ''}
                      index={inputIndex}
                      onChange={onCodeLineInputChange}
                    />
                  )
                  return widget
                }
                return text
              })

              return (
                <Sortable.Item key={item.id} id={item.id} className='-translate-x-10'>
                  <CodeLineEditor
                    key={line.number.toString()}
                    blocks={blocks}
                    indentation={line.indentation.value}
                    isAddInputDisabled={false}
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
          }}
        </Sortable.Container>
      </div>

      <div className='w-max mx-auto'>
        <AddItemButton onClick={onAddCodeLine}>Adicionar linha de código</AddItemButton>
      </div>
    </div>
  )
}
