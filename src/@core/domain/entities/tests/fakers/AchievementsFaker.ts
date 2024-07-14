import { faker } from '@faker-js/faker'
import { Achievement } from '../../Achievement'
import type { AchievementDTO } from '@/@core/dtos'

export class AchievementsFaker {
  static fake(baseDTO?: Partial<AchievementDTO>): Achievement {
    return Achievement.create(AchievementsFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<AchievementDTO>): AchievementDTO {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      icon: faker.image.avatar(),
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
      ...baseDTO,
    }
  }

  static fakeMany(count?: number): Achievement[] {
    return Array.from({ length: count ?? 10 }).map(() => AchievementsFaker.fake())
  }

  static fakeManyDTO(count?: number): AchievementDTO[] {
    return Array.from({ length: count ?? 10 }).map(() => AchievementsFaker.fake().dto)
  }
}
