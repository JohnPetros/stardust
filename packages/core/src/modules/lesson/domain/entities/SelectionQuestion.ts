import { Image, Logical, ShuffledList, Text } from '#global/structs'
import { Question } from '#lesson/abstracts'
import type { SelectionQuestionDto, QuestionDto } from '#lesson/dtos'
import type { QuestionAnswer } from '#lesson/structs'

type SelectionQuestionProps = {
  options: ShuffledList<string>
  answer: string
  code?: string
}

export class SelectionQuestion extends Question<SelectionQuestionProps> {
  static create(dto: SelectionQuestionDto) {
    return new SelectionQuestion(
      {
        type: 'selection',
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        answer: dto.answer,
        code: dto.code,
        options: ShuffledList.create(dto.options),
      },
      dto.id,
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is SelectionQuestionDto {
    return question.type === 'selection'
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    return Logical.create(
      'Is user answer for selection question correct?',
      String(userAnswer.value).toLocaleLowerCase() === this.answer.toLocaleLowerCase(),
    )
  }

  get options() {
    return this.props.options.items
  }

  get answer() {
    return this.props.answer
  }

  get code() {
    return this.props.code ?? null
  }
}
