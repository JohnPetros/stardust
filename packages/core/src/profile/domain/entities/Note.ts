import { Entity } from '#global/domain/abstracts/Entity'
import { Id, Text } from '#global/domain/structures/index'
import { Datetime } from '#global/libs/index'
import type { NoteDto } from './dtos'

type NoteProps = {
  title: Text
  content: Text
  userId: Id
  createdAt: Date
  updatedAt: Date
}

export class Note extends Entity<NoteProps> {
  static create(dto: NoteDto) {
    const now = new Datetime().date()

    return new Note(
      {
        title: Text.create(dto.title),
        content: Text.create(dto.content),
        userId: Id.create(dto.userId),
        createdAt: dto.createdAt ?? now,
        updatedAt: dto.updatedAt ?? now,
      },
      dto.id,
    )
  }

  get title() {
    return this.props.title
  }

  updateTitle(title: Text) {
    this.props.title = title
  }

  get content() {
    return this.props.content
  }

  updateContent(content: Text) {
    this.props.content = content
  }

  get userId() {
    return this.props.userId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch(updatedAt: Date = new Datetime().date()) {
    this.props.updatedAt = updatedAt
  }

  get dto(): NoteDto {
    return {
      id: this.id.value,
      title: this.title.value,
      content: this.content.value,
      userId: this.userId.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
