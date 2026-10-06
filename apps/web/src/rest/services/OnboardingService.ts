import type { OnboardingService as IOnboardingService } from '@stardust/core/auth/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'

export const OnboardingService = (restClient: RestClient): IOnboardingService => ({
  async fetchAttempt() {
    return await restClient.get('/auth/onboarding-attempt')
  },
})
