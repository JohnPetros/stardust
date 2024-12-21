import type { SelectionQuestionDto, QuestionDto } from '#dtos'
import type { QuestionProps } from '#domain/types'
import { Question } from '#domain/abstracts'
import { Image, Logical, ShuffledList, Text, type QuestionAnswer } from '#domain/structs'

type SelectionQuestionProps = {
  options: ShuffledList<string>
  answer: string
  code?: string
}

export class SelectionQuestion extends Question {
  private questionProps: SelectionQuestionProps

  private constructor(questionProps: QuestionProps, props: SelectionQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.questionProps = props
  }

  static create(dto: SelectionQuestionDto) {
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
    return this.questionProps.options.items
  }

  get answer() {
    return this.questionProps.answer
  }

  get code() {
    return this.questionProps.code ?? null
  }
}
