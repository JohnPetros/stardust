import type { CheckboxQuestionDTO, QuestionDTO } from '@/@core/dtos'
import type { QuestionProps } from '../types'
import { Question } from '../abstracts'
import {
  Image,
  List,
  ShuffledList,
  Text,
  type QuestionAnswer,
  type Logical,
} from '../structs'

type CheckboxQuestionProps = {
  options: ShuffledList<string>
  correctOptions: List<string>
  code?: string
}

export class CheckboxQuestion extends Question {
  private props: CheckboxQuestionProps

  private constructor(questionProps: QuestionProps, props: CheckboxQuestionProps) {
    super({
      id: questionProps.id,
      picture: questionProps.picture,
      statement: questionProps.statement,
      type: questionProps.type,
    })
    this.props = props
  }

  static create(dto: CheckboxQuestionDTO) {
    return new CheckboxQuestion(
      {
        id: dto.id,
        picture: Image.create(dto.picture),
        statement: Text.create(dto.statement),
        type: dto.type,
      },
      {
        code: dto.code,
        correctOptions: List.create(dto.correctOptions),
        options: ShuffledList.create(dto.options),
      },
    )
  }

  static canBeCreatedBy(question: QuestionDTO): question is CheckboxQuestionDTO {
    return question.type === 'checkbox'
  }

  static isCheckboxQuestion(question: Question): question is CheckboxQuestion {
    return question instanceof CheckboxQuestion
  }

  verifyUserAnswer(userAnswer: QuestionAnswer): Logical {
    const usersOptions = List.create(userAnswer.value as string[])

    console.log('this', this.props.correctOptions)
    console.log('usersOptions', usersOptions)

    return usersOptions.includesList(this.props.correctOptions)
  }

  get options() {
    return this.props.options.items
  }

  get code() {
    return this.props.code ?? null
  }
}
