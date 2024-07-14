import { faker } from '@faker-js/faker'
import { Avatar } from '../../Avatar'
import type { AvatarDTO } from '@/@core/dtos'

export class AvatarsFaker {
  static fake(baseDTO?: Partial<AvatarDTO>): Avatar {
    return Avatar.create(AvatarsFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<AvatarDTO>): AvatarDTO {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: faker.image.avatar(),
      price: faker.number.int({ max: 100 }),
      ...baseDTO,
    }
  }

  static fakeManyDTO(count?: number): AvatarDTO[] {
    return Array.from({ length: count ?? 10 }).map(() => AvatarsFaker.fake().dto)
  }
}
