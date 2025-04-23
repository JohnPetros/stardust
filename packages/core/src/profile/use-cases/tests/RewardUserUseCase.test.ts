// import { ProfileServiceMock, SpaceServiceMock } from '#mocks/services'
// import { StarsFaker, PlanetsFaker, UsersFaker } from '#fakers/entities'
// import { StarRewardingPayloadFaker } from '#fakers/structures'
// import { RewardUserUseCase } from '../RewardUserUseCase'

// let profileServiceMock: ProfileServiceMock
// let spaceServiceMock: SpaceServiceMock
// let useCase: RewardUserUseCase

// describe('Reward User Use Case', () => {
//   beforeEach(() => {
//     profileServiceMock = new ProfileServiceMock()
//     spaceServiceMock = new SpaceServiceMock()
//     useCase = new RewardUserUseCase(profileServiceMock)
//   })

//   const UseCaseFixture = async (
//     questionsCount = 5,
//     incorrectAnswersCount = 0,
//     secondsCount = 60,
//   ) => {
//     const currentStar = StarsFaker.fakeDto({ number: 1 })
//     const nextStar = StarsFaker.fakeDto({ number: 2 })
//     await spaceServiceMock.savePlanet(
//       PlanetsFaker.fake({ stars: [currentStar, nextStar] }),
//     )

//     return await useCase.do({
//       userDto: UsersFaker.fakeDto({ coins: 0, xp: 0 }),
//       rewardingPayloadDto: StarRewardingPayloadFaker.fakeDto({
//         questionsCount,
//         incorrectAnswersCount,
//         secondsCount,
//         starId: currentStar.id,
//       }),
//     })
//   }

//   const UseCaseWithNextStarUnlockedFixture = async (
//     questionsCount: number,
//     incorrectAnswersCount: number,
//   ) => {
//     const currentStar = StarsFaker.fakeDto({ number: 1 })
//     const nextStar = StarsFaker.fakeDto({ number: 2 })
//     await spaceServiceMock.savePlanet(
//       PlanetsFaker.fake({ stars: [currentStar, nextStar] }),
//     )

//     return await useCase.do({
//       userDto: UsersFaker.fakeDto({
//         coins: 0,
//         xp: 0,
//         unlockedStarsIds: [currentStar.id, nextStar.id],
//       }),
//       rewardingPayloadDto: StarRewardingPayloadFaker.fakeDto({
//         questionsCount,
//         incorrectAnswersCount,
//         starId: currentStar.id,
//       }),
//     })
//   }

//   it('should calculate the new coins and xp based on the count of questions they answered', async () => {
//     const questionsCount = 5
//     const incorrectAnswersCount = 0

//     const { newCoins, newXp } = await UseCaseFixture(
//       questionsCount,
//       incorrectAnswersCount,
//     )

//     expect(newCoins).toBe(10)
//     expect(newXp).toBe(20)
//   })

//   it('should decrease the calculated new coins and xp amount according to the count of incorrect answers that the user made', async () => {
//     const questionsCount = 5
//     const incorrectAnswersCount = 2

//     const { newCoins, newXp } = await UseCaseFixture(
//       questionsCount,
//       incorrectAnswersCount,
//     )

//     expect(newCoins).toBe(6)
//     expect(newXp).toBe(12)
//   })

//   it('should divide the calculated new coins and xp amount by 2 if the next star is already unlocked', async () => {
//     const questionsCount = 5
//     const incorrectAnswersCount = 0

//     const { newCoins, newXp } = await UseCaseWithNextStarUnlockedFixture(
//       questionsCount,
//       incorrectAnswersCount,
//     )

//     expect(newCoins).toBe(5)
//     expect(newXp).toBe(10)
//   })

//   it('should get the accuracy percentage of questions answered correctly', async () => {
//     let questionsCount = 5
//     let incorrectAnswersCount = 0

//     const response1 = await UseCaseFixture(questionsCount, incorrectAnswersCount)

//     expect(response1.accuracyPercentage).toBe(100)

//     questionsCount = 5
//     incorrectAnswersCount = 2

//     const response2 = await UseCaseFixture(questionsCount, incorrectAnswersCount)

//     expect(response2.accuracyPercentage).toBe(60)
//   })

//   it('should get the time based on the seconds count that the user took to complete the questions', async () => {
//     let secondsCount = 30
//     const response1 = await UseCaseFixture(5, 0, secondsCount)

//     expect(response1.time).toBe('00:30')

//     secondsCount = 60
//     const response2 = await UseCaseFixture(5, 0, secondsCount)

//     expect(response2.time).toBe('01:00')

//     secondsCount = 75
//     const response3 = await UseCaseFixture(5, 0, secondsCount)

//     expect(response3.time).toBe('01:15')
//   })

//   it('should fetch and unlock the next star', async () => {
//     const currentStar = StarsFaker.fakeDto({ number: 1 })
//     const nextStar = StarsFaker.fakeDto({ number: 2 })

//     await spaceServiceMock.savePlanet(
//       PlanetsFaker.fake({ stars: [currentStar, nextStar] }),
//     )

//     await useCase.do({
//       userDto: UsersFaker.fakeDto({ unlockedStarsIds: [currentStar.id] }),
//       rewardingPayloadDto: StarRewardingPayloadFaker.fakeDto({
//         starId: currentStar.id,
//       }),
//     })

//     expect(spaceServiceMock.unlockedStarsIds.includes(nextStar.id)).toBeTruthy()
//   })

//   it('should fetch and unlock the next star from the next planet if the current star is the last one of its own planet', async () => {
//     const currentStar = StarsFaker.fakeDto()
//     const nextStar = StarsFaker.fakeDto()

//     await Promise.all([
//       spaceServiceMock.savePlanet(
//         PlanetsFaker.fake({ position: 1, stars: [currentStar] }),
//       ),
//       spaceServiceMock.savePlanet(PlanetsFaker.fake({ position: 2, stars: [nextStar] })),
//     ])

//     await useCase.do({
//       userDto: UsersFaker.fakeDto(),
//       rewardingPayloadDto: StarRewardingPayloadFaker.fakeDto({
//         starId: currentStar.id,
//       }),
//     })

//     expect(spaceServiceMock.unlockedStarsIds.includes(nextStar.id)).toBeTruthy()
//   })

//   it('should not throw any error at all even if the current star is the last one of the last planet', async () => {
//     const currentStar = StarsFaker.fakeDto()

//     await spaceServiceMock.savePlanet(PlanetsFaker.fake({ stars: [currentStar] }))

//     const { newCoins, newXp } = await useCase.do({
//       userDto: UsersFaker.fakeDto({ coins: 0, xp: 0 }),
//       rewardingPayloadDto: StarRewardingPayloadFaker.fakeDto({
//         questionsCount: 5,
//         incorrectAnswersCount: 0,
//         starId: currentStar.id,
//       }),
//     })

//     expect(newCoins).toBe(10)
//     expect(newXp).toBe(20)
//   })
// })
