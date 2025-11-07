import { faker } from '@faker-js/faker'

import type { UserDto } from '../dtos'
import { User } from '../User'
import {
  AvatarAggregatesFaker,
  RocketAggregatesFaker,
  TierAggregatesFaker,
} from '../../aggregates/fakers'
import { WeekStatus } from '../../structures'

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
      createdAt: faker.date.birthdate(),
      canSeeRankingResult: false,
      avatar: AvatarAggregatesFaker.fakeDto(),
      rocket: RocketAggregatesFaker.fakeDto(),
      tier: TierAggregatesFaker.fakeDto(),
      weekStatus: WeekStatus.DEFAULT_WEEK_STATUS,
      hasCompletedSpace: false,
      completedChallengesIds: [],
      completedPlanetsIds: [],
      rescuableAchievementsIds: [],
      unlockedAchievementsIds: [],
      unlockedStarsIds: [],
      recentlyUnlockedStarsIds: [],
      acquiredRocketsIds: [],
      acquiredAvatarsIds: [],
      unlockedDocsIds: [],
      ...baseDto,
    }
  }

  static fakeMany(count?: number, baseDto?: Partial<UserDto>): User[] {
    return Array.from({ length: count ?? 10 }).map(() => UsersFaker.fake(baseDto))
  }

  static fakeManyDto(count?: number, baseDto?: Partial<UserDto>): UserDto[] {
    return Array.from({ length: count ?? 10 }).map(() => UsersFaker.fakeDto(baseDto))
  }
}
