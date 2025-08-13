import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import type { AuthContextValue } from '@/ui/auth/contexts/AuthContext/types'

export function useAuthContextMock(returnMock?: Partial<AuthContextValue>) {
  const handleSignIn = jest.fn()
  const handleSignUp = jest.fn()
  const handleSignOut = jest.fn()
  const updateUser = jest.fn()
  const updateUserCache = jest.fn()
  const refetchUser = jest.fn()
  const notifyUserChanges = jest.fn()
  const user = UsersFaker.fake()

  // jest.mocked(useAuthContext).mockReturnValue({
  //   user,
  //   isLoading: false,
  //   accessToken: null,
  //   handleSignIn: handleSignIn,
  //   handleSignOut: handleSignOut,
  //   updateUser: updateUser,
  //   updateUserCache: updateUserCache,
  //   notifyUserChanges: notifyUserChanges,
  //   refetchUser: refetchUser,
  //   ...returnMock,
  // })

  return {
    user,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    updateUser,
    updateUserCache,
  }
}
