import { faker } from '@faker-js/faker'

import { ApiKey } from '../ApiKey'
import type { ApiKeyDto } from '../dtos'

export class ApiKeysFaker {
  static fake(baseDto?: Partial<ApiKeyDto>): ApiKey {
    return ApiKey.create(ApiKeysFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ApiKeyDto>): ApiKeyDto {
    return {
      id: faker.string.uuid(),
      name: faker.word.words({ count: { min: 2, max: 3 } }),
      keyHash: faker.string.hexadecimal({ length: 64, prefix: '' }),
      keyPreview: `sk_${faker.string.alphanumeric(3)}...${faker.string.alphanumeric(4)}`,
      userId: faker.string.uuid(),
      createdAt: faker.date.recent(),
      revokedAt: undefined,
      ...baseDto,
    }
  }
}
