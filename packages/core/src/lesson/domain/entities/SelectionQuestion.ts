import {
  Image,
  ShuffledList,
  Text,
  Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import { Question } from '../abstracts'
import type { SelectionQuestionDto, QuestionDto } from './dtos'

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
        stem: Text.create(dto.stem),
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

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    return Logical.create(
      String(userAnswer.value).toLocaleLowerCase() === this.answer.toLocaleLowerCase(),
    )
  }

  addOption(option: string) {
    this.props.options = this.props.options.add(option)
  }

  removeOption(optionIndex: number) {
    const option = this.props.options.items[optionIndex]
    if (option === this.answer) {
      this.props.answer = this.props.options.items[0]
    }
    this.props.options = this.props.options.remove(optionIndex)
  }

  changeOption(optionIndex: number, option: string) {
    this.props.options = this.props.options.change(optionIndex, option)
  }

  get options(): ShuffledList<string> {
    return this.props.options
  }

  set options(options: string[]) {
    this.props.options = ShuffledList.create(options, false)
  }

  get answer(): string {
    return this.props.answer
  }

  set answer(answer: string) {
    this.props.answer = answer
  }

  get code(): string | undefined {
    return this.props.code
  }

  set code(code: string) {
    this.props.code = code
  }

  get dto(): SelectionQuestionDto {
    return {
      id: this.id.value,
      type: 'selection',
      stem: this.stem.value,
      picture: this.picture.value,
      options: this.options.items,
      answer: this.answer,
      code: this.code ?? undefined,
    }
  }
}
