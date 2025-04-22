import { faker } from '@faker-js/faker'

import type { UserDto } from '../../../../dtos'
import { AvatarsFaker, RocketsFaker, TiersFaker } from '#fakers/entities'
import { WeekStatus } from '../../../../../profile/domain/structs'
import { User } from '../../User'

export class UsersFaker {
  static fake(baseDto?: Partial<UserDto>): User {
    return User.create(UsersFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<UserDto>): UserDto {
    const fakeAvatar = AvatarsFaker.fake()
    const fakeTier = TiersFaker.fake()
    const fakeRocket = RocketsFaker.fake()

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
      weekStatus: WeekStatus.DEFAULT_WEEK_STATUS,
      canSeeRankingResult: false,
      avatar: {
        id: fakeAvatar.id,
        dto: fakeAvatar.dto,
      },
      tier: {
        id: fakeTier.id,
        dto: fakeTier.dto,
      },
      rocket: {
        id: fakeRocket.id,
        dto: fakeRocket.dto,
      },
      createdAt: faker.date.birthdate(),
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
