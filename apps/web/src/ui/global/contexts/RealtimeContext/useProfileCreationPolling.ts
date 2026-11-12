'use client'

import { useMemo } from 'react'

import type { Account } from '@stardust/core/auth/entities'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { RestResponse } from '@stardust/core/global/responses'
import { type Id, Name } from '@stardust/core/global/structures'
import { User } from '@stardust/core/profile/entities'
import type { ProfileChannel, ProfileService } from '@stardust/core/profile/interfaces'

import { PROFILE_CREATION_POLLING } from '@/constants'
import { PollingProfileChannel } from '@/realtime/polling/channels'
import type { ProfileCreationPoll } from '@/realtime/polling/types'

type Params = {
  profileService: ProfileService
  account: Account | null
  accessToken: string | null
}

type OnboardingAttempt = NonNullable<
  Awaited<ReturnType<ProfileService['fetchOnboardingAttempt']>>['body']
>

const STOPPED: ProfileCreationPoll = { status: 'stopped' }
const PENDING: ProfileCreationPoll = { status: 'pending' }
const FAILED: ProfileCreationPoll = { status: 'failed' }

function toFailurePoll(response: RestResponse<unknown>): ProfileCreationPoll {
  const isAuthorizationFailure =
    response.statusCode === HTTP_STATUS_CODE.unauthorized ||
    response.statusCode === HTTP_STATUS_CODE.forbidden
  return isAuthorizationFailure ? STOPPED : FAILED
}

function createdPoll(
  userId: string,
  userName: string,
  userEmail: string,
  userSlug: string,
): ProfileCreationPoll {
  return { status: 'created', payload: { userId, userName, userEmail, userSlug } }
}

function toAttemptPoll(attempt: OnboardingAttempt | null): ProfileCreationPoll {
  if (attempt === null) return STOPPED
  if (!attempt.isUserCreated) return PENDING

  const { id, name, email } = attempt.account
  return createdPoll(id, name, email, Name.create(name).slug.value)
}

function toUserPoll({ id, name, email, slug }: User) {
  return createdPoll(id.value, name.value, email.value, slug.value)
}

function toAccountFailurePoll(response: RestResponse<unknown>) {
  return response.statusCode === HTTP_STATUS_CODE.notFound
    ? PENDING
    : toFailurePoll(response)
}

async function pollByAccount(profileService: ProfileService, accountId: Id) {
  const response = await profileService.fetchUserById(accountId)
  return response.isSuccessful
    ? toUserPoll(User.create(response.body))
    : toAccountFailurePoll(response)
}

async function pollByReceipt(profileService: ProfileService) {
  const response = await profileService.fetchOnboardingAttempt()
  return response.isSuccessful ? toAttemptPoll(response.body) : toFailurePoll(response)
}

function createPoll({ profileService, account, accessToken }: Params) {
  if (!account?.isAuthenticated.isTrue) return () => pollByReceipt(profileService)
  if (!accessToken) return async () => STOPPED
  return () => pollByAccount(profileService, account.id)
}

function createChannel(params: Params): ProfileChannel {
  return PollingProfileChannel({
    pollProfileCreation: createPoll(params),
    ...PROFILE_CREATION_POLLING,
  })
}

export function useProfileCreationPolling(params: Params): ProfileChannel {
  const { profileService, account, accessToken } = params
  const sessionKey = account?.isAuthenticated.isTrue ? account.id.value : null

  // biome-ignore lint/correctness/useExhaustiveDependencies: sessionKey identifies the account; the Account instance changes identity between renders
  return useMemo(() => createChannel(params), [profileService, sessionKey, accessToken])
}
