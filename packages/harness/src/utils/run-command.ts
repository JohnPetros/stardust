import { spawn } from 'node:child_process'

export type CommandResult = {
  command: string[]
  exitCode: number | null
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
}

export async function runCommand(
  command: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; timeoutMs?: number } = {},
): Promise<CommandResult> {
  if (command.length === 0) throw new Error('Comando vazio')

  return new Promise((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), {
      cwd: options.cwd,
      env: options.env ?? process.env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk)
    })
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk)
    })
    child.on('error', reject)

    let forceKillTimer: NodeJS.Timeout | undefined
    const timer =
      options.timeoutMs === undefined
        ? undefined
        : setTimeout(() => {
            child.kill('SIGTERM')
            forceKillTimer = setTimeout(() => child.kill('SIGKILL'), 2_000)
          }, options.timeoutMs)

    child.on('close', (exitCode, signal) => {
      if (timer) clearTimeout(timer)
      if (forceKillTimer) clearTimeout(forceKillTimer)
      resolve({ command, exitCode, signal, stdout, stderr })
    })
  })
}
