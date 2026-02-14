import { faker } from '@faker-js/faker'
import { Chat } from '../Chat'
import type { ChatDto } from '../dtos'

export class ChatFaker {
  static fake(overrides?: Partial<ChatDto>): Chat {
    const dto: ChatDto = {
      id: faker.string.uuid(),
      name: faker.lorem.words({ min: 2, max: 5 }),
      createdAt: faker.date.recent().toISOString(),
      ...overrides,
    }

    return Chat.create(dto)
  }

  static fakeMany(count: number, overrides?: Partial<ChatDto>): Chat[] {
    return Array.from({ length: count }, () => ChatFaker.fake(overrides))
  }
}
