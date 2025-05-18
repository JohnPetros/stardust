import type { Email } from '#global/domain/structures/Email'
import type { Id } from '#global/domain/structures/Id'
import type { Logical } from '#global/domain/structures/Logical'
import type { Name } from '#global/domain/structures/Name'
import type { Slug } from '#global/domain/structures/Slug'
import type { User } from '../domain/entities'

export interface UsersRepository {
  findById(id: Id): Promise<User | null>
  findBySlug(slug: Slug): Promise<User | null>
  hasWithEmail(email: Email): Promise<Logical>
  hasWithName(name: Name): Promise<Logical>
  findAll(): Promise<User[]>
  add(user: User): Promise<void>
  replace(user: User): Promise<void>
  replaceMany(users: User[]): Promise<void>
}
