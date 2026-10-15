import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireAvatarUseCase } from '@stardust/core/profile/use-cases'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

type Schema = {
  body: {
    avatarId: string
    avatarName: string
    avatarImage: string
    avatarPrice: number
  }
}

export class AcquireAvatarController implements Controller<Schema> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const account = await http.getAccount()
    const body = await http.getBody()
    const user = await this.acquire(String(account.id), body)
    return http.send(user)
  }

  private acquire(userId: string, body: Schema['body']) {
    return this.createAcquireAvatarUseCase().execute({
      userId,
      ...this.itemInput(body),
    })
  }

  private itemInput(body: Schema['body']) {
    const { avatarId, avatarName, avatarImage, avatarPrice } = body
    return { avatarId, avatarName, avatarImage, avatarPrice }
  }

  private createAcquireAvatarUseCase() {
    return new AcquireAvatarUseCase(
      this.database,
      this.usersRepository,
      new InngestBroker(),
    )
  }
}
