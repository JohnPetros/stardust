import { faker } from '@faker-js/faker'
import { Avatar } from '../../Avatar'
import type { AvatarDto } from '../../../../dtos'

export class AvatarsFaker {
  static fake(baseDto?: Partial<AvatarDto>): Avatar {
    return Avatar.create(AvatarsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AvatarDto>): AvatarDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: `${faker.image.avatar()}.jpg`,
      price: faker.number.int({ max: 100 }),
      isAcquiredByDefault: false,
      isSelectedByDefault: false,
      ...baseDto,
    }
  }

  static fakeManyDto(count?: number): AvatarDto[] {
    return Array.from({ length: count ?? 10 }).map(() => AvatarsFaker.fake().dto)
  }
}
