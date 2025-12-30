import { Entity } from '#global/domain/abstracts/index'
import { Name } from '#global/domain/structures/index'
import type { ChatDto } from './dtos/ChatDto'

type ChatProps = {
  name: Name
  createdAt: Date
}

export class Chat extends Entity<ChatProps> {
  static create(dto: ChatDto) {
    return new Chat(
      {
        name: Name.create(dto.name),
        createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
      },
      dto.id,
    )
  }

  get name() {
    return this.props.name
  }

  set name(name: Name) {
    this.props.name = name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto() {
    return {
      id: this.id.value,
      name: this.name.value,
      createdAt: this.createdAt.toISOString(),
    }
  }
}
