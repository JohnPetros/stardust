import { faker } from '@faker-js/faker'

import type { UserDTO } from '@/@core/dtos'
import { User } from '../../User'
import { AvatarsFaker } from './AvatarsFaker'
import { RankingsFaker } from './RankingsFaker'
import { RocketsFaker } from './RocketsFaker'

export class UsersFaker {
  static fake(baseDTO?: Partial<UserDTO>): User {
    return User.create(UsersFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<UserDTO>): UserDTO {
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
      completedChallengesIds: [],
      completedPlanetsIds: [],
      rescuableAchievementsIds: [],
      unlockedAchievementsIds: [],
      unlockedStarsIds: [],
      acquiredRocketsIds: [],
      avatar: AvatarsFaker.fake().dto,
      ranking: RankingsFaker.fake().dto,
      rocket: RocketsFaker.fake().dto,
      ...baseDTO,
    }
  }

  static fakeMany(count?: number): User[] {
    return Array.from({ length: count ?? 10 }).map(() => UsersFaker.fake())
  }

  static fakeManyDTO(count?: number): UserDTO[] {
    return Array.from({ length: count ?? 10 }).map(() => UsersFaker.fakeDTO())
  }
}
