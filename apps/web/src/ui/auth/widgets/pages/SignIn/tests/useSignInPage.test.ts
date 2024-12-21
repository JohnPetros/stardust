import { renderHook, waitFor } from '@testing-library/react'

import { useAuthContextMock } from '@/ui/auth/contexts/AuthContext/tests/mocks'
import { useToastContextMock } from '@/ui/global/contexts/ToastContext/tests/mocks'
import { useRouterMock } from '@/ui/global/hooks/tests/mocks'
import { animationRefMock } from '@/ui/global/widgets/components/Animation/tests/mocks'
import { ROUTES } from '@/constants'

import { useSignInPage } from '../useSignInPage'

jest.mock('@/ui/global/contexts/AuthContext')
jest.mock('@/ui/global/contexts/ToastContext')
jest.mock('@/ui/global/hooks/useRouter')

const fakeEmail = 'fake email'
const fakePassword = 'fake password'
const fakeErrorMessage = 'fake-error-message'
const fakeUrl = `http://fake-localhost/sign-in?fake-param=fake-param-value&error=${fakeErrorMessage}`

const Hook = () => renderHook(() => useSignInPage(fakeUrl, animationRefMock))

describe('useSignInPage hook', () => {
  beforeAll(() => {
    useAuthContextMock()
    useToastContextMock()
    useRouterMock()
  })

  it('should try to sign in with email and password', async () => {
    const { handleSignInMock } = useAuthContextMock()

    const { result } = Hook()

    await result.current.handleFormSubmit({ email: fakeEmail, password: fakePassword })

    expect(handleSignInMock).toHaveBeenCalledWith(fakeEmail, fakePassword)
  })

  it('should do nothing if there is a failure on handle sign in', async () => {
    useAuthContextMock({ handleSignIn: async () => false })

    const { result } = Hook()

    expect(result.current.isRocketVisible).toBe(false)

    await result.current.handleFormSubmit({ email: fakeEmail, password: fakePassword })

    expect(result.current.isRocketVisible).toBe(false)
  })

  it('should start rocket animation on sign in successfully', async () => {
    useAuthContextMock({ handleSignIn: async () => true })

    const { result } = Hook()

    expect(result.current.isRocketVisible).toBe(false)

    await result.current.handleFormSubmit({ email: fakeEmail, password: fakePassword })

    await waitFor(() => {
      expect(result.current.isRocketVisible).toBe(true)
      expect(animationRefMock.current.restart).toHaveBeenCalled()
    })
  })

  it('should go to the space route on sign in successfully', async () => {
    useAuthContextMock({ handleSignIn: async () => true })
    const { goToMock } = useRouterMock()

    const { result } = Hook()

    expect(result.current.isRocketVisible).toBe(false)

    await result.current.handleFormSubmit({ email: fakeEmail, password: fakePassword })

    await waitFor(() => {
      expect(goToMock).toHaveBeenCalledWith(ROUTES.private.app.home.space)
    })
  })

  it('should show error message on toast if there is a error message in the url', async () => {
    const { showMock } = useToastContextMock()

    const { result } = Hook()

    expect(result.current.isRocketVisible).toBe(false)

    await waitFor(() => {
      expect(showMock).toHaveBeenCalledWith('Fake Error Message', expect.anything())
    })
  })
})
