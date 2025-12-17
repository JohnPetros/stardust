import { createContext } from 'react-router'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { StorageService } from '@stardust/core/storage/interfaces'
import type { LessonService } from '@stardust/core/lesson/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ShopService } from '@stardust/core/shop/interfaces'

type RestContext = {
  authService: AuthService
  spaceService: SpaceService
  storageService: StorageService
  lessonService: LessonService
  profileService: ProfileService
  challengingService: ChallengingService
  shopService: ShopService
}

export const restContext = createContext<RestContext>()
