import { SpaceServiceMock, UsersServiceMock } from '@/@core/__tests__/mocks/services'
import { RewardUserUseCase } from '../RewardUserUseCase'
import {
  PlanetsFaker,
  StarsFaker,
  UsersFaker,
} from '@/@core/domain/entities/tests/fakers'
import { StarRewardingPayloadFaker } from '@/@core/domain/structs/tests/fakers'

let usersServiceMock: UsersServiceMock
let spaceServiceMock: SpaceServiceMock
let useCase: RewardUserUseCase

describe('Reward User Use Case', () => {
  beforeEach(() => {
    usersServiceMock = new UsersServiceMock()
    spaceServiceMock = new SpaceServiceMock()
    useCase = new RewardUserUseCase(usersServiceMock, spaceServiceMock)
  })

  const UseCaseFixture = async (
    questionsCount = 5,
    incorrectAnswersCount = 0,
    secondsCount = 60,
  ) => {
    const currentStar = StarsFaker.fakeDTO({ number: 1 })
    const nextStar = StarsFaker.fakeDTO({ number: 2 })
    await spaceServiceMock.savePlanet(
      PlanetsFaker.fake({ stars: [currentStar, nextStar] }),
    )

    return await useCase.do({
      userDTO: UsersFaker.fakeDTO({ coins: 0, xp: 0 }),
      rewardingPayloadDTO: StarRewardingPayloadFaker.fakeDTO({
        questionsCount,
        incorrectAnswersCount,
        secondsCount,
        starId: currentStar.id,
      }),
    })
  }

  const UseCaseWithNextStarUnlockedFixture = async (
    questionsCount: number,
    incorrectAnswersCount: number,
  ) => {
    const currentStar = StarsFaker.fakeDTO({ number: 1 })
    const nextStar = StarsFaker.fakeDTO({ number: 2 })
    await spaceServiceMock.savePlanet(
      PlanetsFaker.fake({ stars: [currentStar, nextStar] }),
    )

    return await useCase.do({
      userDTO: UsersFaker.fakeDTO({
        coins: 0,
        xp: 0,
        unlockedStarsIds: [currentStar.id, nextStar.id],
      }),
      rewardingPayloadDTO: StarRewardingPayloadFaker.fakeDTO({
        questionsCount,
        incorrectAnswersCount,
        starId: currentStar.id,
      }),
    })
  }

  it('should calculate the new coins and xp based on the count of questions they answered', async () => {
    const questionsCount = 5
    const incorrectAnswersCount = 0

    const { user } = await UseCaseFixture(questionsCount, incorrectAnswersCount)

    expect(user.coins.value).toBe(10)
    expect(user.xp.value).toBe(20)
  })

  it('should decrease the calculated new coins and xp amount according to the count of incorrect answers that the user made', async () => {
    const questionsCount = 5
    const incorrectAnswersCount = 2

    const { user } = await UseCaseFixture(questionsCount, incorrectAnswersCount)

    expect(user.coins.value).toBe(6)
    expect(user.xp.value).toBe(12)
  })

  it('should divide the calculated new coins and xp amount by 2 if the next star is already unlocked', async () => {
    const questionsCount = 5
    const incorrectAnswersCount = 0

    const { user } = await UseCaseWithNextStarUnlockedFixture(
      questionsCount,
      incorrectAnswersCount,
    )

    expect(user.coins.value).toBe(5)
    expect(user.xp.value).toBe(10)
  })

  it('should get the accuracy percentage of questions answered correctly', async () => {
    let questionsCount = 5
    let incorrectAnswersCount = 0

    const response1 = await UseCaseFixture(questionsCount, incorrectAnswersCount)

    expect(response1.accuracyPercentage).toBe(100)

    questionsCount = 5
    incorrectAnswersCount = 2

    const response2 = await UseCaseFixture(questionsCount, incorrectAnswersCount)

    expect(response2.accuracyPercentage).toBe(60)
  })

  it('should get the time based on the seconds count that the user took to complete the questions', async () => {
    let secondsCount = 30
    const response1 = await UseCaseFixture(5, 0, secondsCount)

    expect(response1.time).toBe('00:30')

    secondsCount = 60
    const response2 = await UseCaseFixture(5, 0, secondsCount)

    expect(response2.time).toBe('01:00')

    secondsCount = 75
    const response3 = await UseCaseFixture(5, 0, secondsCount)

    expect(response3.time).toBe('01:15')
  })

  it('should fetch and unlock the next star', async () => {
    const currentStar = StarsFaker.fakeDTO({ number: 1 })
    const nextStar = StarsFaker.fakeDTO({ number: 2 })

    await spaceServiceMock.savePlanet(
      PlanetsFaker.fake({ stars: [currentStar, nextStar] }),
    )

    const { user } = await useCase.do({
      userDTO: UsersFaker.fakeDTO({ unlockedStarsIds: [currentStar.id] }),
      rewardingPayloadDTO: StarRewardingPayloadFaker.fakeDTO({
        starId: currentStar.id,
      }),
    })

    expect(user.hasUnlockedStar(nextStar.id)).toBeTruthy()
    expect(spaceServiceMock.unlockedStarsIds.includes(nextStar.id)).toBeTruthy()
  })

  it('should fetch and unlock the next star from the next planet if the current star is the last one of its own planet', async () => {
    const currentStar = StarsFaker.fakeDTO()
    const nextStar = StarsFaker.fakeDTO()

    await Promise.all([
      spaceServiceMock.savePlanet(
        PlanetsFaker.fake({ position: 1, stars: [currentStar] }),
      ),
      spaceServiceMock.savePlanet(PlanetsFaker.fake({ position: 2, stars: [nextStar] })),
    ])

    const { user } = await useCase.do({
      userDTO: UsersFaker.fakeDTO(),
      rewardingPayloadDTO: StarRewardingPayloadFaker.fakeDTO({
        starId: currentStar.id,
      }),
    })

    expect(user.hasUnlockedStar(nextStar.id)).toBeTruthy()
    expect(spaceServiceMock.unlockedStarsIds.includes(nextStar.id)).toBeTruthy()
  })

  it('should not throw any error at all even if the current star is the last one of the last planet', async () => {
    const currentStar = StarsFaker.fakeDTO()

    await spaceServiceMock.savePlanet(PlanetsFaker.fake({ stars: [currentStar] }))

    const { user } = await useCase.do({
      userDTO: UsersFaker.fakeDTO({ coins: 0, xp: 0 }),
      rewardingPayloadDTO: StarRewardingPayloadFaker.fakeDTO({
        questionsCount: 5,
        incorrectAnswersCount: 0,
        starId: currentStar.id,
      }),
    })

    expect(user.coins.value).toBe(10)
    expect(user.xp.value).toBe(20)
  })
})
