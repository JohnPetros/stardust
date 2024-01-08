import { type User, type WinnerUser } from '@/@types/user'

export interface IUsersController {
  getUserById(userId: string): Promise<User>
  getUserBySlug(userSlug: string): Promise<User>
  getUserEmail(email: string): Promise<{ email: string } | null>
  getUsersByRanking(rankingId: string): Promise<User[]>
  getWinnerUsers(lastWeekRankingId: string): Promise<WinnerUser[]>
  updateUser(newUserData: Partial<User>, userId: string): Promise<void>
  addUser({
    id,
    name,
    email,
  }: Pick<User, 'id' | 'name' | 'email'>): Promise<void>
}
