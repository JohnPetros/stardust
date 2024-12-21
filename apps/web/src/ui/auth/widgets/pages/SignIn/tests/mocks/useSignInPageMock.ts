import { animationRefMock } from '@/ui/global/components/shared/Animation/tests/mocks'

import { useSignInPage } from '../../useSignInPage'

export function useSignInPageMock(
  returnMock?: Partial<ReturnType<typeof useSignInPage>>
) {
  const handleFormSubmitMock = jest.fn()

  jest.mocked(useSignInPage).mockReturnValue({
    isRocketVisible: false,
    rocketAnimationRef: animationRefMock,
    handleFormSubmit: handleFormSubmitMock,
    ...returnMock,
  })

  return {
    handleFormSubmitMock,
  }
}
