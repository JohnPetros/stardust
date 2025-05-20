import type { Email } from '#global/domain/structures/Email'
import type { Id } from '#global/domain/structures/Id'
import type { IdsList } from '#global/domain/structures/IdsList'
import type { Logical } from '#global/domain/structures/Logical'
import type { Name } from '#global/domain/structures/Name'
import type { Slug } from '#global/domain/structures/Slug'
import type { User } from '../domain/entities'

export interface UsersRepository {
  findById(id: Id): Promise<User | null>
  findByIdsList(idsList: IdsList): Promise<User[]>
  findBySlug(slug: Slug): Promise<User | null>
  findByTierOrderedByXp(tierId: Id): Promise<User[]>
  containsWithEmail(email: Email): Promise<Logical>
  containsWithName(name: Name): Promise<Logical>
  findAll(): Promise<User[]>
  add(user: User): Promise<void>
  addAcquiredAvatar(avatarId: Id, userId: Id): Promise<void>
  addAcquiredRocket(rocketId: Id, userId: Id): Promise<void>
  addUnlockedStar(starId: Id, userId: Id): Promise<void>
  replace(user: User): Promise<void>
  replaceMany(users: User[]): Promise<void>
}
