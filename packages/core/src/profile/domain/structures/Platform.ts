import { ValidationError } from '#global/domain/errors/ValidationError'
import { StringValidation } from '#global/libs/index'

export type PlatformName = 'web' | 'mobile'

export class Platform {
  readonly name: PlatformName

  private constructor(name: PlatformName) {
    this.name = name
  }

  static create(name: string): Platform {
    if (!Platform.isPlatformName(name)) {
      throw new ValidationError([
        { name: 'platform', messages: ['Platform name must be "web" or "mobile"'] },
      ])
    }

    return new Platform(name)
  }

  static isPlatformName(name: string): name is PlatformName {
    new StringValidation(name, 'Platform Name').oneOf(['web', 'mobile']).validate()
    return true
  }

  static createAsWeb(): Platform {
    return new Platform('web')
  }

  static createAsMobile(): Platform {
    return new Platform('mobile')
  }
}
