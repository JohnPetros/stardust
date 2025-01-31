import { UsersFaker } from '@stardust/core/fakers/entities'

import { useAuthContext } from '../..'

export function useAuthContextMock(
  returnMock?: Partial<ReturnType<typeof useAuthContext>>,
) {
  const handleSignInMock = jest.fn()
  const handleSignUpMock = jest.fn()
  const handleSignOutMock = jest.fn()
  const updateUserMock = jest.fn()
  const updateUserCacheMock = jest.fn()
  const fakeUser = UsersFaker.fake()

  jest.mocked(useAuthContext).mockReturnValue({
    user: fakeUser,
    isLoading: false,
    serverSession: null,
    handleSignIn: handleSignInMock,
    handleSignOut: handleSignOutMock,
    updateUser: updateUserMock,
    updateUserCache: updateUserCacheMock,
    ...returnMock,
  })

  return {
    fakeUser,
    handleSignInMock,
    handleSignUpMock,
    handleSignOutMock,
    updateUserMock,
    updateUserCacheMock,
  }
}
