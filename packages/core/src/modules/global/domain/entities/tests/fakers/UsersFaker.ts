import { faker } from '@faker-js/faker'

import { User } from '../../User'
import type { UserDto } from '#global/dtos'
import { AvatarsFaker, RocketsFaker, TiersFaker } from '#fakers/entities'

export class UsersFaker {
  static fake(baseDto?: Partial<UserDto>): User {
    return User.create(UsersFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<UserDto>): UserDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      slug: faker.lorem.slug(),
      email: faker.internet.email(),
      coins: faker.number.int({ max: 100 }),
      level: faker.number.int({ min: 1, max: 100 }),
      streak: faker.number.int({ max: 100 }),
      xp: faker.number.int({ max: 100 }),
      weeklyXp: faker.number.int({ max: 100 }),
      lastWeekRankingPosition: faker.number.int({ min: 1, max: 100 }),
      completedChallengesIds: [],
      completedPlanetsIds: [],
      rescuableAchievementsIds: [],
      unlockedAchievementsIds: [],
      unlockedStarsIds: [],
      acquiredRocketsIds: [],
      acquiredAvatarsIds: [],
      unlockedDocsIds: [],
      weekStatus: ['todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'],
      canSeeRankingResult: false,
      didIncrementStreakOnSaturday: false,
      avatar: AvatarsFaker.fake().dto,
      tier: TiersFaker.fake().dto,
      rocket: RocketsFaker.fake().dto,
      createdAt: faker.date.birthdate().toString(),
      ...baseDto,
    }
  }

  static fakeMany(count?: number): User[] {
    return Array.from({ length: count ?? 10 }).map(() => UsersFaker.fake())
  }

  static fakeManyDto(count?: number, baseDto?: Partial<UserDto>): UserDto[] {
    return Array.from({ length: count ?? 10 }).map(() => UsersFaker.fakeDto(baseDto))
  }
}
