// Opens Penpot in a dedicated Chrome instance whose tabs never sleep, so the
// Penpot MCP plugin keeps its connection.
// Usage: node scripts/open-penpot.mjs [url]
// It always uses the Stardust profile, which keeps its own Penpot login.
import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const defaultUrl = 'https://design.penpot.app'
const profileName = 'Stardust'
const keepAwakeFlags = [
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
]

function fail(message) {
  console.error(message)
  process.exit(1)
}

const isWsl =
  os.platform() === 'linux' && /microsoft/i.test(fs.readFileSync('/proc/version', 'utf8'))

function powershell(command) {
  return execFileSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', command],
    {
      cwd: '/mnt/c',
      encoding: 'utf8',
    },
  )
    .replace(/\r/g, '')
    .trim()
}

function quotePowershell(value) {
  return `'${value.replace(/'/g, "''")}'`
}

function findExecutable(names) {
  for (const name of names) {
    try {
      return execFileSync('which', [name], { encoding: 'utf8' }).trim()
    } catch {}
  }
  return null
}

function resolveTarget() {
  if (isWsl) {
    return {
      profileDirectory: `${powershell('$env:LOCALAPPDATA')}\\Chrome${profileName}`,
      chrome: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    }
  }
  if (os.platform() === 'darwin') {
    return {
      profileDirectory: path.join(
        os.homedir(),
        'Library',
        'Application Support',
        `Chrome${profileName}`,
      ),
      chrome: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    }
  }
  const chrome = findExecutable([
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ])
  if (!chrome) fail('Chrome not found')
  return {
    profileDirectory: path.join(
      os.homedir(),
      '.config',
      `chrome-${profileName.toLowerCase()}`,
    ),
    chrome,
  }
}

function readUserDataDirectory(commandLine) {
  const match =
    commandLine.match(/"--user-data-dir=([^"]+)"/) ??
    commandLine.match(/--user-data-dir=(?:"([^"]+)"|([^\s"]+))/)
  return match ? (match[1] ?? match[2]) : null
}

// Main browser processes (not renderers or helpers) started with this profile.
function findInstance(profileDirectory) {
  let processes
  if (isWsl) {
    const json = powershell(
      `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress`,
    )
    processes = json
      ? [JSON.parse(json)]
          .flat()
          .map((p) => ({ pid: p.ProcessId, commandLine: p.CommandLine ?? '' }))
      : []
  } else {
    processes = execFileSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' })
      .split('\n')
      .map((line) => line.trim().match(/^(\d+)\s+(.*)$/))
      .filter(Boolean)
      .map(([, pid, commandLine]) => ({ pid: Number(pid), commandLine }))
  }
  const sameDirectory = (directory) =>
    isWsl
      ? directory.toLowerCase() === profileDirectory.toLowerCase()
      : directory === profileDirectory
  return processes.filter((p) => {
    if (/\s--type=/.test(p.commandLine)) return false
    const directory = readUserDataDirectory(p.commandLine)
    return directory !== null && sameDirectory(directory)
  })
}

function launch({ chrome, profileDirectory }, url) {
  const args = [`--user-data-dir=${profileDirectory}`, ...keepAwakeFlags, '--new-window', url]
  if (isWsl) {
    // Start-Process joins arguments with spaces, so quote only those containing one.
    const windowsArgs = args.map((arg) =>
      quotePowershell(/\s/.test(arg) ? `"${arg}"` : arg),
    )
    powershell(
      `Start-Process ${quotePowershell(chrome)} -ArgumentList ${windowsArgs.join(',')}`,
    )
    return
  }
  if (!fs.existsSync(chrome)) fail(`Chrome not found at ${chrome}`)
  spawn(chrome, args, { detached: true, stdio: 'ignore' }).unref()
}

const url = process.argv[2] ?? defaultUrl
if (!/^https?:\/\//.test(url)) fail(`expected an http(s) URL, got: ${url}`)

const target = resolveTarget()
const wasRunning = findInstance(target.profileDirectory).length > 0
launch(target, url)

let instance = []
for (let attempt = 0; attempt < 20 && instance.length === 0; attempt++) {
  await sleep(500)
  instance = findInstance(target.profileDirectory)
}
if (instance.length === 0)
  fail(`Chrome did not start with profile ${target.profileDirectory}`)

console.log(`opened ${url}`)
console.log(
  `profile ${target.profileDirectory} (pid ${instance.map((p) => p.pid).join(', ')})`,
)
if (wasRunning)
  console.log('this profile was already open, so the page opened in a new window of it')
const missingFlags = keepAwakeFlags.filter(
  (flag) => !instance.some((p) => p.commandLine.includes(flag)),
)
if (missingFlags.length > 0) {
  console.log(
    `warning: the open window lacks ${missingFlags.join(' ')}; close every window of this profile and run again`,
  )
}
