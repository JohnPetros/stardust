import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterInstances,
  isTransientInteropError,
  readUserDataDirectory,
} from '../open-penpot.mjs'
import { assertScriptSyntax } from './helpers.mjs'

test('open-penpot has valid syntax', async () => {
  await assertScriptSyntax('open-penpot.mjs')
})

test('readUserDataDirectory reads quoted and unquoted flags', () => {
  assert.equal(
    readUserDataDirectory(
      'chrome --user-data-dir=/home/me/.config/chrome-stardust --new-window',
    ),
    '/home/me/.config/chrome-stardust',
  )
  assert.equal(
    readUserDataDirectory(
      'chrome "--user-data-dir=C:\\Users\\me\\Chrome Stardust" --new-window',
    ),
    'C:\\Users\\me\\Chrome Stardust',
  )
  assert.equal(
    readUserDataDirectory('chrome --user-data-dir="/path with space/profile" --flag'),
    '/path with space/profile',
  )
})

test('readUserDataDirectory returns null without the flag', () => {
  assert.equal(readUserDataDirectory('chrome --new-window'), null)
})

test('isTransientInteropError detects the WSL vsock timeout', () => {
  assert.equal(
    isTransientInteropError({
      stderr: '<3>WSL (203329 - ) ERROR: UtilAcceptVsock:273: accept4 failed 110\n',
    }),
    true,
  )
  assert.equal(
    isTransientInteropError({ stderr: 'Start-Process : file not found' }),
    false,
  )
  assert.equal(isTransientInteropError(new Error('boom')), false)
})

const profile = '/home/me/.config/chrome-stardust'

test('filterInstances keeps only main processes of the profile', () => {
  const processes = [
    { pid: 1, commandLine: `chrome --user-data-dir=${profile}` },
    { pid: 2, commandLine: `chrome --type=renderer --user-data-dir=${profile}` },
    { pid: 3, commandLine: 'chrome --user-data-dir=/home/me/.config/other' },
    { pid: 4, commandLine: 'chrome --new-window' },
  ]
  assert.deepEqual(
    filterInstances(processes, profile, false).map((p) => p.pid),
    [1],
  )
})

test('filterInstances compares directories case-sensitively on Linux', () => {
  const processes = [
    { pid: 1, commandLine: `chrome --user-data-dir=${profile.toUpperCase()}` },
  ]
  assert.equal(filterInstances(processes, profile, false).length, 0)
})

test('filterInstances ignores directory case for Windows paths', () => {
  const windowsProfile = 'C:\\Users\\me\\AppData\\Local\\ChromeStardust'
  const processes = [
    {
      pid: 1,
      commandLine:
        '"chrome.exe" "--user-data-dir=c:\\users\\ME\\appdata\\local\\chromestardust"',
    },
  ]
  assert.equal(filterInstances(processes, windowsProfile, true).length, 1)
})
