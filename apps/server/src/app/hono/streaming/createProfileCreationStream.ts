import { setTimeout as delay } from 'node:timers/promises'
import type { Context } from 'hono'
import { streamSSE, type SSEStreamingApi } from 'hono/streaming'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { Id } from '@stardust/core/global/structures'

type Authorization = { accountId: Id; expiresAt: Date | null }
type ProfileUser = NonNullable<Awaited<ReturnType<UsersRepository['findById']>>>
type StreamLifecycle = {
  stopped: boolean
  terminal?: 'created' | 'expired' | 'aborted' | 'cap'
  expiresAt: number
  deadline: number
  pollTimer?: ReturnType<typeof setTimeout>
  heartbeat?: ReturnType<typeof setInterval>
  endTimer?: ReturnType<typeof setTimeout>
  wakePoll?: () => void
  expiryWrite?: Promise<void>
  removeListeners: () => void
}

function cancelTimers(lifecycle: StreamLifecycle): void {
  clearTimeout(lifecycle.pollTimer)
  clearInterval(lifecycle.heartbeat)
  clearTimeout(lifecycle.endTimer)
}

function stop(lifecycle: StreamLifecycle): void {
  if (lifecycle.stopped) return
  lifecycle.stopped = true
  cancelTimers(lifecycle)
  lifecycle.wakePoll?.()
  lifecycle.removeListeners()
}

function abort(stream: SSEStreamingApi, lifecycle: StreamLifecycle): void {
  lifecycle.terminal ??= 'aborted'
  stop(lifecycle)
  stream.abort()
  void stream.close()
}

function finalizeDeadline(stream: SSEStreamingApi, lifecycle: StreamLifecycle): void {
  if (Date.now() < lifecycle.deadline) return
  finishDeadline(stream, lifecycle)
}

function finishDeadline(stream: SSEStreamingApi, lifecycle: StreamLifecycle): void {
  if (lifecycle.terminal === 'created') abort(stream, lifecycle)
  if (lifecycle.terminal) return
  lifecycle.terminal = Date.now() < lifecycle.expiresAt ? 'cap' : 'expired'
  if (lifecycle.terminal === 'cap') abort(stream, lifecycle)
  else publishExpiry(stream, lifecycle)
}

function publishExpiry(stream: SSEStreamingApi, lifecycle: StreamLifecycle): void {
  lifecycle.expiryWrite = writeExpiry(stream)
  stop(lifecycle)
}

function expire(stream: SSEStreamingApi, lifecycle: StreamLifecycle): void {
  if (lifecycle.stopped) return
  if (Date.now() < lifecycle.deadline) {
    scheduleDeadline(stream, lifecycle)
    return
  }
  finalizeDeadline(stream, lifecycle)
}

function forceExpiryClose(stream: SSEStreamingApi): void {
  stream.abort()
  void stream.close()
}

function expiryTimeout(stream: SSEStreamingApi, signal: AbortSignal): Promise<void> {
  return delay(100, undefined, { signal })
    .then(() => forceExpiryClose(stream))
    .catch(() => {})
}

function settleExpiry(stream: SSEStreamingApi, signal: AbortSignal): Promise<void> {
  return Promise.race([
    stream.writeSSE({ event: 'onboarding.expired', data: '{}' }).catch(() => {}),
    expiryTimeout(stream, signal),
  ])
}

async function writeExpiry(stream: SSEStreamingApi): Promise<void> {
  const timeout = new AbortController()
  try {
    await settleExpiry(stream, timeout.signal)
  } finally {
    timeout.abort()
    void stream.close()
  }
}

function scheduleDeadline(stream: SSEStreamingApi, lifecycle: StreamLifecycle): void {
  lifecycle.endTimer = setTimeout(
    () => expire(stream, lifecycle),
    Math.max(0, lifecycle.deadline - Date.now()),
  )
}

function removeAbortListeners(context: Context, onAbort: () => void): void {
  context.req.raw.signal.removeEventListener('abort', onAbort)
  process.removeListener('SIGINT', onAbort)
  process.removeListener('SIGTERM', onAbort)
}

function addAbortListeners(
  context: Context,
  stream: SSEStreamingApi,
  onAbort: () => void,
): void {
  stream.onAbort(onAbort)
  context.req.raw.signal.addEventListener('abort', onAbort, { once: true })
  process.once('SIGINT', onAbort)
  process.once('SIGTERM', onAbort)
}

function registerHeartbeat(
  stream: SSEStreamingApi,
  lifecycle: StreamLifecycle,
  onAbort: () => void,
): void {
  lifecycle.heartbeat = setInterval(() => {
    if (!lifecycle.stopped) void stream.write(': heartbeat\n\n').catch(onAbort)
  }, 15_000)
}

function registerLifecycle(
  context: Context,
  stream: SSEStreamingApi,
  lifecycle: StreamLifecycle,
): void {
  const onAbort = () => abort(stream, lifecycle)
  lifecycle.removeListeners = () => removeAbortListeners(context, onAbort)
  scheduleDeadline(stream, lifecycle)
  registerHeartbeat(stream, lifecycle, onAbort)
  addAbortListeners(context, stream, onAbort)
}

function profileData(user: ProfileUser): string {
  return JSON.stringify({
    userId: user.id.value,
    userName: user.name.value,
    userEmail: user.email.value,
    userSlug: user.slug.value,
  })
}

async function writeUserCreated(
  stream: SSEStreamingApi,
  user: ProfileUser,
): Promise<void> {
  await stream.writeSSE({
    event: 'user.created',
    id: `profile:${user.id.value}`,
    data: profileData(user),
  })
}

function pollingEnded(lifecycle: StreamLifecycle): boolean {
  return lifecycle.stopped || Date.now() >= lifecycle.deadline
}

async function waitForPoll(lifecycle: StreamLifecycle): Promise<void> {
  await new Promise<void>((resolve) => {
    lifecycle.wakePoll = resolve
    lifecycle.pollTimer = setTimeout(resolve, 1000)
  })
  lifecycle.wakePoll = undefined
}

async function finishProfilePoll(
  stream: SSEStreamingApi,
  user: ProfileUser,
  accountId: Id,
  lifecycle: StreamLifecycle,
): Promise<void> {
  if (user.id.value !== accountId.value) return
  lifecycle.terminal = 'created'
  await writeUserCreated(stream, user)
}

type ProfilePolling = {
  stream: SSEStreamingApi
  usersRepository: UsersRepository
  accountId: Id
  lifecycle: StreamLifecycle
}

async function continueProfilePoll(
  polling: ProfilePolling,
  user: ProfileUser | null,
): Promise<boolean> {
  if (user) {
    await finishProfilePoll(polling.stream, user, polling.accountId, polling.lifecycle)
    return false
  }
  await waitForPoll(polling.lifecycle)
  return true
}

async function pollOnce(polling: ProfilePolling): Promise<boolean> {
  const user = await polling.usersRepository.findById(polling.accountId)
  if (pollingEnded(polling.lifecycle)) return false
  return continueProfilePoll(polling, user)
}

async function pollProfile(polling: ProfilePolling): Promise<void> {
  while (!pollingEnded(polling.lifecycle)) {
    if (!(await pollOnce(polling))) break
  }
}

function receiptDeadline(authorization: Authorization): number {
  return authorization.expiresAt?.getTime() ?? Infinity
}

function createLifecycle(authorization: Authorization): StreamLifecycle {
  const expiresAt = receiptDeadline(authorization)
  return {
    stopped: false,
    expiresAt,
    deadline: Math.min(Date.now() + 60_000, expiresAt),
    removeListeners: () => {},
  }
}

async function completeLifecycle(
  stream: SSEStreamingApi,
  lifecycle: StreamLifecycle,
): Promise<void> {
  finalizeDeadline(stream, lifecycle)
  stop(lifecycle)
  await lifecycle.expiryWrite
}

function pollingInput(input: ProfileStream, lifecycle: StreamLifecycle): ProfilePolling {
  return {
    stream: input.stream,
    usersRepository: input.usersRepository,
    accountId: input.authorization.accountId,
    lifecycle,
  }
}

function abortIfRequested(input: ProfileStream, lifecycle: StreamLifecycle): boolean {
  if (!input.context.req.raw.signal.aborted) return false
  abort(input.stream, lifecycle)
  return true
}

async function beginPolling(
  input: ProfileStream,
  lifecycle: StreamLifecycle,
): Promise<void> {
  if (abortIfRequested(input, lifecycle)) return
  await input.stream.write('retry:1000\n\n')
  await pollProfile(pollingInput(input, lifecycle))
}

type ProfileStream = {
  context: Context
  stream: SSEStreamingApi
  usersRepository: UsersRepository
  authorization: Authorization
}

async function attemptPolling(
  input: ProfileStream,
  lifecycle: StreamLifecycle,
): Promise<void> {
  try {
    await beginPolling(input, lifecycle)
  } catch {
    console.error('Profile creation stream failed')
  } finally {
    await completeLifecycle(input.stream, lifecycle)
  }
}

async function runProfileCreationStream(input: ProfileStream): Promise<void> {
  const lifecycle = createLifecycle(input.authorization)
  registerLifecycle(input.context, input.stream, lifecycle)
  await attemptPolling(input, lifecycle)
}

function applyStreamHeaders(context: Context, response: Response): void {
  context.header('Cache-Control', 'no-store,no-transform')
  context.header('X-Accel-Buffering', 'no')
  response.headers.set('Cache-Control', 'no-store,no-transform')
  response.headers.set('X-Accel-Buffering', 'no')
}

export function createProfileCreationStream(
  context: Context,
  usersRepository: UsersRepository,
  authorization: Authorization,
): Response {
  const response = streamSSE(context, (stream) =>
    runProfileCreationStream({ context, stream, usersRepository, authorization }),
  )
  applyStreamHeaders(context, response)
  return response
}
