import type { SelectionQuestionDTO, QuestionDTO } from '@/@core/dtos'
import { Question } from '../abstracts'
import type { QuestionProps } from '../abstracts/Question'
import { Image, Integer, Logical, ShuffledList, type QuestionAnswer } from '../structs'

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
      position: questionProps.position,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.props = props
  }

  static create(dto: SelectionQuestionDTO) {
    return new SelectionQuestion(
      {
        id: dto.id,
        position: Integer.create('', dto.position),
        picture: Image.create(dto.picture),
        statement: dto.statement,
        type: dto.type,
      },
      {
        answer: dto.answer,
        options: ShuffledList.create(dto.options),
      },
    )
  }

  static canBeCreatedBy(question: QuestionDTO): question is SelectionQuestionDTO {
    const selectionQuestionProps = ['options', 'answer']
    const questionProps = Object.keys(question)

    return selectionQuestionProps.every((prop) => questionProps.includes(prop))
  }

  static isSelectionQuestion(question: Question): question is SelectionQuestion {
    return question instanceof SelectionQuestion
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
