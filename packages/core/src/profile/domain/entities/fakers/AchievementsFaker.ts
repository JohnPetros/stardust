import { faker } from '@faker-js/faker'

import type { AchievementDto } from '../dtos'
import { Achievement } from '../Achievement'

export class AchievementsFaker {
  static fake(baseDto?: Partial<AchievementDto>): Achievement {
    return Achievement.create(AchievementsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AchievementDto>): AchievementDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      icon: `${faker.image.avatar()}.jpg`,
      reward: faker.number.int({ min: 1, max: 100 }),
      requiredCount: faker.number.int({ min: 1, max: 100 }),
      position: faker.number.int({ min: 1, max: 20 }),
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

  static fakeMany(count?: number, baseDto?: Partial<AchievementDto>): Achievement[] {
    return Array.from({ length: count ?? 10 }).map(() => AchievementsFaker.fake(baseDto))
  }

  static fakeManyDto(
    count?: number,
    baseDto?: Partial<AchievementDto>,
  ): AchievementDto[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      AchievementsFaker.fakeDto(baseDto),
    )
  }
}
