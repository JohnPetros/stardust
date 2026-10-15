import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Controller } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireInsigniaUseCase } from '@stardust/core/profile/use-cases'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

type Schema = {
  body: {
    insigniaRole: string
    insigniaPrice: number
  }
}

export class AcquireInsigniaController implements Controller<Schema> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const account = await http.getAccount()
    const body = await http.getBody()
    const user = await this.acquire(String(account.id), body)
    return http.send(user)
  }

  private acquire(userId: string, body: Schema['body']) {
    const { insigniaRole, insigniaPrice } = body
    return this.createAcquireInsigniaUseCase().execute({
      userId,
      insigniaRole,
      insigniaPrice,
    })
  }

  private createAcquireInsigniaUseCase() {
    return new AcquireInsigniaUseCase(this.database, this.repository, new InngestBroker())
  }
}
