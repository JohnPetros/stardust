import type { RestResponse } from '#global/responses/index'

export interface OnboardingService {
  fetchAttempt(): Promise<
    RestResponse<{
      account: { id: string; email: string; name: string }
      expiresAt: string
      isUserCreated: boolean
    } | null>
  >
}
