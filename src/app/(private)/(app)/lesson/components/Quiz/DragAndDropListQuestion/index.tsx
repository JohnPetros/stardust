import { DragAndDropList } from '@/types/question'
import { QuestionTitle } from '../QuestionTitle'
import { Item } from './Item'

interface DragAndDropListQuestionProps {
  data: DragAndDropList
}

export function DragAndDropListQuestion({
  data: { title, items, picture },
}: DragAndDropListQuestionProps) {
  return (
    <div className="mx-auto mt-16 w-full max-w-xl flex flex-col items-center justify-center cursor-grab">
      <QuestionTitle picture={picture}>{title}</QuestionTitle>

      <div className="mx-auto w-full space-y-2 mt-8">
        {items.map((item) => (
          <Item key={item.id} label={item.label} />
        ))}
      </div>
    </div>
  )
}
