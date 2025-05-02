import type { User } from '../domain/entities'
import type { List } from '#global/domain/structures/List'
import type { Id } from '#global/domain/structures/Id'
import type { Email } from '#global/domain/structures/Email'

export interface UsersRepository {
  add(user: User): Promise<void>
  findAll(): Promise<List<User>>
  findById(id: Id): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  update(user: User): Promise<void>
}
