import { mock, type Mock } from 'ts-jest-mocker'
import type { Database } from '#global/interfaces/Database'
import type { Broker } from '#global/interfaces/Broker'
import { UsersFaker } from '../../domain/entities/fakers/UsersFaker'
import { UserCreatedEvent } from '../../domain/events'
import { FinishUserCreationUseCase } from '../FinishUserCreationUseCase'

describe('FinishUserCreationUseCase', () => {
  let database: Mock<Database>
  let broker: Mock<Broker>
  let useCase: FinishUserCreationUseCase

  beforeEach(() => {
    database = mock<Database>()
    database.run.mockImplementation(async (operation) => operation())
    broker = mock<Broker>()
    broker.publish.mockResolvedValue(undefined)
    useCase = new FinishUserCreationUseCase(database, broker)
  })

  it('enqueues the created user details within the database boundary', async () => {
    const user = UsersFaker.fake()
    const request = {
      userId: user.id.value,
      userName: user.name.value,
      userEmail: 'user@example.com',
      userSlug: user.slug.value,
    }

    await useCase.execute(request)

    expect(database.run).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(new UserCreatedEvent(request))
  })

  it('propagates enqueue failure', async () => {
    const user = UsersFaker.fake()
    const error = new Error('Outbox unavailable')
    broker.publish.mockRejectedValue(error)

    await expect(
      useCase.execute({
        userId: user.id.value,
        userName: user.name.value,
        userEmail: 'user@example.com',
        userSlug: user.slug.value,
      }),
    ).rejects.toBe(error)
  })
})
