import { randomUUID } from 'node:crypto'

import { SessionDto } from '@stardust/core/auth/structures/dtos'
import { AccountDto } from '@stardust/core/auth/entities/dtos'
import { AppError } from '@stardust/core/global/errors'
import { SupabaseClient } from '@supabase/supabase-js'

type CreateAccountInput = {
  email?: string
  password?: string
  name?: string
}

export class AuthFixture {
  private account: AccountDto | null = null
  private session: SessionDto | null = null

  constructor(private readonly supabase: SupabaseClient) {}

  async createAccount(input?: CreateAccountInput): Promise<void> {
    const email = input?.email ?? `test-${randomUUID()}@stardust.dev`
    const password = input?.password ?? 'password123'
    const name = input?.name ?? `Test User ${randomUUID().slice(0, 8)}`

    const signUpResponse = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (signUpResponse.error) {
      throw new Error(`Failed to sign up test account: ${signUpResponse.error.message}`)
    }

    const signInResponse = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (
      signInResponse.error ||
      !signInResponse.data.user ||
      !signInResponse.data.session
    ) {
      throw new Error(
        `Failed to sign in test account: ${signInResponse.error?.message ?? 'missing session'}`,
      )
    }

    this.account = {
      id: signInResponse.data.user.id,
      email,
      name: signInResponse.data.user.user_metadata.name,
      isAuthenticated: true,
    }
    this.session = {
      account: this.account,
      accessToken: signInResponse.data.session.access_token,
      refreshToken: signInResponse.data.session.refresh_token,
      durationInSeconds: signInResponse.data.session.expires_in,
    }
  }

  getAccount(): AccountDto {
    if (!this.account) {
      throw new AppError('No authenticated account')
    }

    return this.account
  }

  getAccountId(): string {
    const account = this.getAccount()
    return String(account?.id)
  }

  getSession(): SessionDto {
    if (!this.session) {
      throw new AppError('No authenticated session')
    }

    return this.session
  }

  getAuthorizationHeader(): { Authorization: string } {
    if (!this.session) {
      throw new AppError('No authenticated session')
    }

    return {
      Authorization: `Bearer ${this.session.accessToken}`,
    }
  }
}
