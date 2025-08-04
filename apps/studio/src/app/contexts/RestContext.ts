import { unstable_createContext } from 'react-router'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import type { StorageService } from '@stardust/core/storage/interfaces'
import type { LessonService } from '@stardust/core/lesson/interfaces'

type RestContext = {
  authService: AuthService
  spaceService: SpaceService
  storageService: StorageService
  lessonService: LessonService
}

export const restContext = unstable_createContext<RestContext>()
