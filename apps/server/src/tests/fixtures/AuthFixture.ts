import { randomUUID } from 'node:crypto'

import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AppError } from '@stardust/core/global/errors'
import { ENV } from '@/constants'
import { LocalSupabaseProxy } from './LocalSupabaseProxy'

const MAILPIT_POLL_INTERVAL_MS = 200
const MAILPIT_TIMEOUT_MS = 10000

type MailpitAddress = { Address?: string }
type MailpitMessageSummary = { ID: string; To?: MailpitAddress[] }
type MailpitSearchResponse = { messages?: MailpitMessageSummary[] }
type MailpitMessage = {
  ID?: string
  To?: MailpitAddress[]
  HTML?: string
  Text?: string
}

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
    await LocalSupabaseProxy.ensureRunning()

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
      throw new Error('Failed to sign up test account')
    }

    await this.confirmSignUp(email)

    const signInResponse = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (
      signInResponse.error ||
      !signInResponse.data.user ||
      !signInResponse.data.session
    ) {
      throw new Error('Failed to sign in test account')
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

  private async confirmSignUp(email: string): Promise<void> {
    const mailpitApiUrl = ENV.mailpitApiUrl
    if (!mailpitApiUrl) {
      throw new Error('MAILPIT_API_URL is required to confirm test accounts')
    }

    const deadline = Date.now() + MAILPIT_TIMEOUT_MS
    while (Date.now() < deadline) {
      const searchUrl = new URL('/api/v1/search', mailpitApiUrl)
      searchUrl.searchParams.set('query', `to:${email}`)
      searchUrl.searchParams.set('limit', '50')

      const search = await this.mailpitJson<MailpitSearchResponse>(searchUrl)
      const candidates = (search.messages ?? []).filter((message) => {
        return (
          typeof message.ID === 'string' &&
          message.To?.some((recipient) => {
            return recipient.Address?.toLowerCase() === email.toLowerCase()
          })
        )
      })

      for (const candidate of candidates) {
        const messageUrl = new URL(
          `/api/v1/message/${encodeURIComponent(candidate.ID)}`,
          mailpitApiUrl,
        )
        const message = await this.mailpitJson<MailpitMessage>(messageUrl)
        const tokenHash = this.getLocalConfirmationToken(email, message)

        if (!tokenHash || !message.ID) continue
        const { error } = await this.supabase.auth.verifyOtp({
          type: 'email',
          token_hash: tokenHash,
        })

        if (error) {
          throw new Error('Failed to confirm test account email')
        }

        await this.deleteMailpitMessage(mailpitApiUrl, message.ID)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, MAILPIT_POLL_INTERVAL_MS))
    }

    throw new Error('Timed out waiting for local signup confirmation email')
  }

  private async mailpitJson<T>(url: URL): Promise<T> {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) {
      throw new Error('Mailpit API request failed')
    }

    return (await response.json()) as T
  }

  private async deleteMailpitMessage(baseUrl: string, messageId: string): Promise<void> {
    const response = await fetch(new URL('/api/v1/messages', baseUrl), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IDs: [messageId] }),
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error('Failed to delete consumed local signup email')
    }
  }

  private getLocalConfirmationToken(
    email: string,
    message: MailpitMessage,
  ): string | undefined {
    if (
      message.To?.every((recipient) => {
        return recipient.Address?.toLowerCase() !== email.toLowerCase()
      })
    ) {
      return undefined
    }

    const content = `${message.HTML ?? ''}\n${message.Text ?? ''}`
    const links = [...content.matchAll(/href\s*=\s*(["'])(.*?)\1/gi)].map((match) => {
      return match[2].replace(/&amp;/gi, '&').replace(/&#x2f;/gi, '/')
    })

    for (const link of links) {
      let confirmationUrl: URL

      try {
        confirmationUrl = new URL(link)
      } catch {
        continue
      }

      const isLocalCallback =
        confirmationUrl.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(confirmationUrl.hostname) &&
        confirmationUrl.pathname === '/api/auth/confirm-email' &&
        !confirmationUrl.username &&
        !confirmationUrl.password &&
        !confirmationUrl.hash
      const tokens = confirmationUrl.searchParams.getAll('token')

      if (isLocalCallback && tokens.length === 1 && tokens[0]) {
        return tokens[0]
      }
    }

    return undefined
  }
}
