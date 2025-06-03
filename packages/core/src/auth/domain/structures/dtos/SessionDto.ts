import type { AccountDto } from '../../entities/dtos'

export type SessionDto = {
  account: AccountDto
  accessToken: string
  refreshToken: string
  durationInSeconds: number
}
