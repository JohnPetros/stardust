import {
  Image,
  List,
  ShuffledList,
  Text,
  type Logical,
  type UserAnswer,
} from '#global/domain/structures/index'
import { Question } from '../abstracts'

import type { CheckboxQuestionDto, QuestionDto } from './dtos'

type CheckboxQuestionProps = {
  options: ShuffledList<string>
  correctOptions: List<string>
  code?: string
}

export class CheckboxQuestion extends Question<CheckboxQuestionProps> {
  static create(dto: CheckboxQuestionDto) {
    return new CheckboxQuestion(
      {
        type: 'checkbox',
        picture: Image.create(dto.picture),
        stem: Text.create(dto.stem),
        code: dto.code,
        correctOptions: List.create(dto.correctOptions),
        options: ShuffledList.create(dto.options),
      },
      dto.id,
    )
  }

  static canBeCreatedBy(question: QuestionDto): question is CheckboxQuestionDto {
    return question.type === 'checkbox'
  }

  static isCheckboxQuestion(question: Question): question is CheckboxQuestion {
    return question instanceof CheckboxQuestion
  }

  verifyUserAnswer(userAnswer: UserAnswer): Logical {
    const usersOptions = List.create(userAnswer.value as string[])
    return usersOptions.isEqualTo(this.props.correctOptions)
  }

  addOption(option: string): void {
    this.props.options = this.props.options.add(option)
  }

  removeOption(optionIndex: number): void {
    this.props.options = this.props.options.remove(optionIndex)
  }

  changeOption(optionIndex: number, option: string) {
    this.props.options = this.props.options.change(optionIndex, option)
  }

  changeCorrectOption(option: string): void {
    if (this.props.correctOptions.items.includes(option)) {
      this.props.correctOptions = this.props.correctOptions.remove(option)
    } else {
      this.props.correctOptions = this.props.correctOptions.add(option)
    }
  }

  removeCode(): void {
    this.props.code = undefined
  }

  get options() {
    return this.props.options.items
  }

  get correctOptions() {
    return this.props.correctOptions.items
  }

  get code(): string | undefined {
    return this.props.code
  }

  set code(code: string) {
    this.props.code = code
  }

  get dto(): CheckboxQuestionDto {
    return {
      id: this.id.value,
      type: 'checkbox',
      picture: this.picture.value,
      stem: this.stem.value,
      options: this.options,
      correctOptions: this.props.correctOptions.items,
      code: this.code ?? undefined,
    }
  }
}
