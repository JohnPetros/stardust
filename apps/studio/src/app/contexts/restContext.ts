import type { AuthService } from '@stardust/core/auth/interfaces'
import type { SpaceService } from '@stardust/core/space/interfaces'
import { unstable_createContext } from 'react-router'

type RestContext = {
  authService: AuthService
  spaceService: SpaceService
}

export const restContext = unstable_createContext<RestContext>()
