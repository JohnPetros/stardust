import type { AuthService as IAuthService } from '@stardust/core/auth/interfaces'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Email, Name, Text } from '@stardust/core/global/structures'
import type { Password } from '@stardust/core/auth/structures'

export const AuthService = (restClient: RestClient): IAuthService => {
  return {
    async fetchAccount() {
      return await restClient.get('/auth/account')
    },

    async signIn(email: Email, password: Password) {
      return await restClient.post('/auth/sign-in', {
        email: email.value,
        password: password.value,
      })
    },

    async signUp() {
      throw new MethodNotImplementedError('signUp')
    },

    async signOut() {
      return await restClient.post('/auth/sign-out')
    },

    async resendSignUpEmail(email: Email) {
      return await restClient.post('/auth/resend-email/sign-up', {
        email: email.value,
      })
    },

    async requestSignUp(email: Email, password: Password, name: Name) {
      return await restClient.post('/auth/sign-up', {
        email: email.value,
        password: password.value,
        name: name.value,
      })
    },

    async requestPasswordReset(email: Email) {
      return await restClient.post('/auth/request-password-reset', {
        email: email.value,
      })
    },

    async resetPassword(newPassword: Password, accessToken: Text, refreshToken: Text) {
      return await restClient.patch('/auth/reset-password', {
        newPassword: newPassword.value,
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      })
    },

    async confirmEmail(token: Text) {
      return await restClient.post('/auth/confirm-email', { token: token.value })
    },

    async confirmPasswordReset(token: Text) {
      return await restClient.post('/auth/confirm-password-reset', { token: token.value })
    },
  }
}
