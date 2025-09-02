import type { AuthService as IAuthService } from '@stardust/core/auth/interfaces'
import { MethodNotImplementedError } from '@stardust/core/global/errors'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Email, Name, Text } from '@stardust/core/global/structures'
import type { Password } from '@stardust/core/auth/structures'
import type { Account } from '@stardust/core/auth/entities'

export const AuthService = (restClient: RestClient): IAuthService => {
  return {
    async fetchAccount() {
      return await restClient.get('/auth/account')
    },

    async fetchSocialAccount() {
      return await restClient.get('/auth/social-account')
    },

    async signIn(email: Email, password: Password) {
      return await restClient.post('/auth/sign-in', {
        email: email.value,
        password: password.value,
      })
    },

    async signInWithGoogleAccount() {
      return await restClient.post('/auth/sign-in/google')
    },

    async signInWithGithubAccount() {
      return await restClient.post('/auth/sign-in/github')
    },

    async signUp() {
      throw new MethodNotImplementedError('signUp')
    },

    async signUpWithSocialAccount(account: Account) {
      return await restClient.post('/auth/sign-up/social-account', account.dto)
    },

    async signOut() {
      return await restClient.delete('/auth/sign-out')
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

    async refreshSession(refreshToken: Text) {
      return await restClient.post('/auth/refresh-session', {
        refreshToken: refreshToken.value,
      })
    },

    async confirmEmail(token: Text) {
      return await restClient.post('/auth/confirm-email', { token: token.value })
    },

    async confirmPasswordReset(token: Text) {
      return await restClient.post('/auth/confirm-password-reset', { token: token.value })
    },

    async connectGithubAccount(returnUrl: Text) {
      return await restClient.get(`/auth/connect/github?returnUrl=${returnUrl.value}`)
    },

    async connectGoogleAccount(returnUrl: Text) {
      return await restClient.get(`/auth/connect/google?returnUrl=${returnUrl.value}`)
    },
  }
}
