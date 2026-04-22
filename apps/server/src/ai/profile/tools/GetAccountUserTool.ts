import { GetUserUseCase } from '@stardust/core/profile/use-cases'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { Mcp, Tool } from '@stardust/core/global/interfaces'

export class GetAccountUserTool implements Tool<void, UserDto> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(mcp: Mcp<void>): Promise<UserDto> {
    const accountId = mcp.getAccountId()
    const useCase = new GetUserUseCase(this.usersRepository)
    return await useCase.execute({ userId: accountId })
  }
}
