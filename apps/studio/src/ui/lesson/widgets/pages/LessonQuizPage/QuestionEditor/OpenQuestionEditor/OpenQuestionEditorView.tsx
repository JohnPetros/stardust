import type { Image, Text } from '@stardust/core/global/structures'
import type { QuestionCodeLine } from '@stardust/core/lesson/structures'

import { Sortable } from '@/ui/global/widgets/components/Sortable'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import { QuestionHeaderInput } from '../QuestionHeaderInput'
import { CodeInput } from '../CodeInput'
import { CodeLineEditor } from '../CodeLineEditor'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'

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
  onDeleteCodeLine: (lineNumber: number) => void
  onCodeLineTextChange: (lineNumber: number, text: string, textIndex: number) => void
  onCodeLineInputChange: (input: string, inputIndex: number) => void
  onCodeLineIndentationChange: (lineNumber: number, indentation: number) => void
  onDragEnd: (newItems: SortableItem<QuestionCodeLine>[]) => void
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
  onDeleteCodeLine,
  onCodeLineTextChange,
  onCodeLineInputChange,
  onCodeLineIndentationChange,
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

      <Sortable.Container items={codeLines} onDragEnd={onDragEnd}>
        {(items) =>
          items.map((item, index) => {
            const line = item.value as QuestionCodeLine
            const blocks = line.texts.map((text) => {
              if (typeof text === 'string') {
                return text
              }
              return (
                <input
                  key={index.toString()}
                  value={answers[index]}
                  onChange={(event) => onCodeLineInputChange(event.target.value, index)}
                />
              )
            })

            return (
              <CodeLineEditor
                key={line.number.toString()}
                blocks={blocks}
                indentation={line.indentation.value}
                onDelete={() => onDeleteCodeLine(line.number.value)}
                onAddCodeLineText={(textIndex) =>
                  onAddCodeLineText(line.number.value, textIndex)
                }
                onAddCodeLineInput={(textIndex) =>
                  onAddCodeLineInput(line.number.value, textIndex)
                }
                onTextChange={(text, textIndex) =>
                  onCodeLineTextChange(line.number.value, text, textIndex)
                }
                onIndentationChange={(indentation) =>
                  onCodeLineIndentationChange(line.number.value, indentation)
                }
              />
            )
          })
        }
      </Sortable.Container>

      <div className='w-max mx-auto'>
        <AddItemButton onClick={onAddCodeLine}>Adicionar linha de código</AddItemButton>
      </div>
    </div>
  )
}
