import type { User } from '#profile/domain/entities/index'

export interface XlsxProvider {
  generateUsersFile(users: User[]): Promise<File>
}
