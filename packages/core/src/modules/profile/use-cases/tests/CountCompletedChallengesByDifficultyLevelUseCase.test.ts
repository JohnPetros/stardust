import { ChallengesFaker, UsersFaker } from '#fakers/entities'
import { ChallengingServiceMock } from '#mocks/services'
import { CountCompletedChallengesByDifficultyLevelUseCase } from '../../../challenging/use-cases/CountCompletedChallengesByDifficultyLevelUseCase'

let challengingServiceMock: ChallengingServiceMock
let useCase: CountCompletedChallengesByDifficultyLevelUseCase

describe('Count Completed Challenges By Difficulty Level Use Case', () => {
  beforeEach(() => {
    challengingServiceMock = new ChallengingServiceMock()
    useCase = new CountCompletedChallengesByDifficultyLevelUseCase(challengingServiceMock)
  })

  it('should return the absolute count of completed challenges by difficulty', async () => {
    const fakeChallenges = ChallengesFaker.fakeManyDto(25, { difficulty: 'easy' })
    challengingServiceMock.challenges = fakeChallenges

    const completedChallengesCount = 15

    const fakeUserDto = UsersFaker.fakeDto({
      completedChallengesIds: fakeChallenges
        .slice(0, completedChallengesCount)
        .map(({ id }) => String(id)),
    })

    const { absolute } = await useCase.do(fakeUserDto)

    expect(absolute.easy).toBe(completedChallengesCount)
  })

  it('should return the percentage count of completed challenges by difficulty', async () => {
    const fakeChallenges = ChallengesFaker.fakeManyDto(25, { difficulty: 'easy' })
    challengingServiceMock.challenges = fakeChallenges

    const completedChallengesCount = 15

    const fakeUserDto = UsersFaker.fakeDto({
      completedChallengesIds: fakeChallenges
        .slice(0, completedChallengesCount)
        .map(({ id }) => String(id)),
    })

    const { percentage } = await useCase.do(fakeUserDto)

    expect(percentage.easy).toBe(60) // 60%
  })

  it('should return the total count of challenges by difficulty', async () => {
    const completedChallengesCount = 25

    const fakeChallenges = ChallengesFaker.fakeManyDto(completedChallengesCount, {
      difficulty: 'easy',
    })
    challengingServiceMock.challenges = fakeChallenges

    const fakeUserDto = UsersFaker.fakeDto({
      completedChallengesIds: fakeChallenges.slice(0, 15).map(({ id }) => String(id)),
    })

    const { total } = await useCase.do(fakeUserDto)

    expect(total.easy).toBe(completedChallengesCount)
  })
})
