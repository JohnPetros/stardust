import type { User } from '@/@types/User'

export interface IUsersController {
  getUserById(userId: string): Promise<User>
  getUserBySlug(userSlug: string): Promise<User>
  getUserEmail(email: string): Promise<{ email: string } | null>
  getUsersByRanking(rankingId: string): Promise<User[]>
  updateUser(newUserData: Partial<User>, userId: string): Promise<void>
  addUser({
    id,
    name,
    email,
  }: Pick<User, 'id' | 'name' | 'email'>): Promise<void>
}
