import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireRocketUseCase } from '@stardust/core/profile/use-cases'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

type Schema = {
  body: {
    rocketId: string
    rocketName: string
    rocketImage: string
    rocketPrice: number
  }
}

export class AcquireRocketController implements Controller<Schema> {
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
    return this.createAcquireRocketUseCase().execute({
      userId,
      ...this.itemInput(body),
    })
  }

  private itemInput(body: Schema['body']) {
    const { rocketId, rocketName, rocketImage, rocketPrice } = body
    return { rocketId, rocketName, rocketImage, rocketPrice }
  }

  private createAcquireRocketUseCase() {
    return new AcquireRocketUseCase(
      this.database,
      this.usersRepository,
      new InngestBroker(),
    )
  }
}
