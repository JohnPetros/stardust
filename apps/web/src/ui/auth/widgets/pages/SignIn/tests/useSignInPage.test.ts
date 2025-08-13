import { act } from 'react'
import { renderHook, waitFor } from '@testing-library/react'

import { useSignInPage } from '../useSignInPage'
import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { useToastContextMock } from '@/ui/global/contexts/ToastContext/tests/mocks'
import { useRouterMock } from '@/ui/global/hooks/tests/mocks/useRouterMock'

jest.mock('@/ui/global/hooks/useAuthContext')
jest.mock('@/ui/global/contexts/ToastContext')
jest.mock('@/ui/global/hooks/useRouter')

describe('useSignInPage hook', () => {
  const email = 'fake email'
  const password = 'fake password'
  const error = 'fake error'
  const nextRoute = 'fake next route'
  const handleSignIn = jest.fn()

  const Hook = () =>
    useSignInPage({
      rocketAnimationRef: animationRefMock,
      error,
      nextRoute,
      handleSignIn,
    })

  beforeAll(() => {
    useToastContextMock()
    useRouterMock()
  })

  it('should call handleSignIn with email and password when form is submitted', async () => {
    const { result } = renderHook(Hook)

    await result.current.handleFormSubmit({ email, password })

    expect(handleSignIn).toHaveBeenCalledWith(email, password)
  })

  it('should do nothing if handleSignIn returns false', async () => {
    handleSignIn.mockReturnValueOnce(false)

    const { result } = renderHook(Hook)

    await result.current.handleFormSubmit({ email, password })

    expect(result.current.isRocketVisible).toBe(false)
  })

  it('should make rocket animation visible and restart it if handleSignIn returns true', async () => {
    handleSignIn.mockReturnValueOnce(true)

    const { result } = renderHook(Hook)

    await act(async () => {
      await result.current.handleFormSubmit({ email, password })
    })

    await waitFor(() => {
      expect(result.current.isRocketVisible).toBe(true)
      expect(animationRefMock.current.restart).toHaveBeenCalled()
    })
  })

  it('should show error toast when an error is provided', async () => {
    const { showError } = useToastContextMock()

    renderHook(Hook)

    expect(showError).toHaveBeenCalledWith(error, expect.any(Number))
  })
})
