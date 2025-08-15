import {
  Image,
  Integer,
  SortableList,
  Text,
  type Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import { Question } from '../abstracts'
import type { DragAndDropListQuestionDto, QuestionDto } from './dtos'
import { AppError } from '#global/domain/errors/index'

type DragAndDropListQuestionProps = {
  sortableList: SortableList
}

export class DragAndDropListQuestion extends Question<DragAndDropListQuestionProps> {
  static create(dto: DragAndDropListQuestionDto): DragAndDropListQuestion {
    return new DragAndDropListQuestion({
      id: dto.id,
      picture: Image.create(dto.picture),
      stem: Text.create(dto.stem),
      type: 'drag-and-drop-list',
      sortableList: SortableList.create(
        dto.items.map((item) => ({
          originalPosition: Integer.create(
            item.position,
            `${item.position}º Drag and drop list question item original position`,
          ),
          label: Text.create(item.label),
        })),
      ),
    })
  }

  static canBeCreatedBy(question: QuestionDto): question is DragAndDropListQuestionDto {
    return question.type === 'drag-and-drop-list'
  }

  static isDragAndDropListQuestion(
    question: Question,
  ): question is DragAndDropListQuestion {
    return question instanceof DragAndDropListQuestion
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    if (!SortableList.isSoratableList(userAnswer.value)) {
      throw new AppError(
        'A resposta do usuário para um pergunta de drag and drop deve ser uma lista ordenável.',
      )
    }

    return this.sortableList.isEqualTo(userAnswer.value)
  }

  addItem(itemLabel: string): void {
    this.sortableList = this.sortableList.addItem({
      originalPosition: Integer.create(this.sortableList.items.length + 1),
      label: Text.create(itemLabel),
    })
  }

  removeItem(itemOriginalPosition: number): void {
    this.sortableList = this.sortableList.removeItem(Integer.create(itemOriginalPosition))
  }

  changeItemLabel(itemOriginalPosition: number, itemLabel: string): void {
    this.props.sortableList = this.sortableList.changeItemLabel(
      Integer.create(itemOriginalPosition),
      Text.create(itemLabel),
    )
  }

  get sortableList(): SortableList {
    return this.props.sortableList
  }

  set sortableList(sortableList: SortableList) {
    this.props.sortableList = sortableList
  }

  get dto(): DragAndDropListQuestionDto {
    return {
      id: this.id.value,
      type: 'drag-and-drop-list',
      stem: this.stem.value,
      picture: this.picture.value,
      items: this.sortableList.items.map((item) => ({
        position: item.originalPosition.value,
        label: item.label.value,
      })),
    }
  }
}
