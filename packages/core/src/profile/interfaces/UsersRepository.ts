import type { User } from '../domain/entities'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
}
