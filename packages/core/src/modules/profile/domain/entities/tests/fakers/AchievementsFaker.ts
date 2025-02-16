import { faker } from '@faker-js/faker'
import type { AchievementDto } from '#profile/dtos'
import { Achievement } from '#profile/entities'

export class AchievementsFaker {
  static fake(baseDto?: Partial<AchievementDto>): Achievement {
    return Achievement.create(AchievementsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AchievementDto>): AchievementDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      icon: `${faker.image.avatar()}.jpg`,
      reward: faker.number.int({ max: 100 }),
      requiredCount: faker.number.int({ max: 100 }),
      position: faker.number.int({ max: 20 }),
      description: faker.lorem.paragraph(),
      metric: faker.helpers.arrayElement([
        'unlockedStarsCount',
        'acquiredRocketsCount',
        'completedChallengesCount',
        'completedPlanetsCount',
        'xp',
        'streak',
      ]),
      ...baseDto,
    }
  }

  static fakeMany(count?: number): Achievement[] {
    return Array.from({ length: count ?? 10 }).map(() => AchievementsFaker.fake())
  }

  static fakeManyDto(count?: number): AchievementDto[] {
    return Array.from({ length: count ?? 10 }).map(() => AchievementsFaker.fake().dto)
  }
}
