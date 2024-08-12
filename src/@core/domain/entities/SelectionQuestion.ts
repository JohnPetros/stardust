import type { SelectionQuestionDTO, QuestionDTO } from '@/@core/dtos'
import type { QuestionProps } from '../types'
import { Question } from '../abstracts'
import { Image, List, Logical, ShuffledList, Text, type QuestionAnswer } from '../structs'

type SelectionQuestionProps = {
  options: ShuffledList<string>
  answer: string
  code?: string
}

export class SelectionQuestion extends Question {
  private props: SelectionQuestionProps

  private constructor(questionProps: QuestionProps, props: SelectionQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.props = props
  }

  static create(dto: SelectionQuestionDTO) {
    return new SelectionQuestion(
      {
        id: dto.id,
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        type: dto.type,
      },
      {
        answer: dto.answer,
        code: dto.code,
        options: ShuffledList.create(dto.options),
      },
    )
  }

  static canBeCreatedBy(question: QuestionDTO): question is SelectionQuestionDTO {
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
