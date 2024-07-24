import type { Image, Integer } from '../structs'
import { BaseEntity } from './BaseEntity'

type QuestionType =
  | 'selection'
  | 'checkbox'
  | 'open'
  | 'drag-and-drop'
  | 'drag-and-drop-list'

export type QuestionProps = {
  id?: string
  type: QuestionType
  statement: string
  picture: Image
  position: Integer
}

export abstract class Question extends BaseEntity {
  protected readonly type: QuestionType
  protected readonly statement: string
  protected readonly picture: Image
  protected readonly position: Integer

  constructor(props: QuestionProps) {
    super(props.id)
    this.type = props.type
    this.statement = props.statement
    this.picture = props.picture
    this.position = props.position
  }
}
