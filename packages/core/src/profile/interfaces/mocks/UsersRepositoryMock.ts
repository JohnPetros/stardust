import { type Id, type Email, List } from '#global/domain/structures/index'
import type { User } from '#profile/domain/entities/index'
import type { UsersRepository } from '../UsersRepository'

export class UsersRepositoryMock implements UsersRepository {
  users: List<User> = List.create([])

  async add(user: User): Promise<void> {
    this.users.add(user)
  }
  async findAll(): Promise<List<User>> {
    return this.users
  }

  async findById(id: Id): Promise<User | null> {
    return this.users.items.find((user) => user.id.value === id.value) ?? null
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.items.find((user) => user.email.value === email.value) ?? null
  }

  async update(user: User): Promise<void> {
    this.users = this.users.map((currentUser) =>
      currentUser.id.value === user.id.value ? user : currentUser,
    )
  }
}
