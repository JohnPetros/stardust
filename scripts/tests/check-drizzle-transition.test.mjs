import assert from 'node:assert/strict'
import { createServer } from 'node:net'
import { test } from 'node:test'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname, basename } from 'node:path'
import { randomUUID } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'
import {
  projectRoot,
  defaultManifestPath,
  advisoryLockKey,
  isMain,
  equalRoleMemberships,
} from '../check-drizzle-transition.mjs'

test('role membership comparison preserves exact distinct tuples regardless of order or duplicate projections', () => {
  const first = {
    role: 'infra_reader',
    member: 'infra_worker',
    admin_option: false,
    inherit_option: true,
    set_option: false,
  }
  const second = { ...first, role: 'infra_writer', admin_option: true }
  const expected = [first, second, first]
  assert.equal(equalRoleMemberships([second, first, first], expected), true)
  assert.equal(equalRoleMemberships([second, first], expected), true)
  assert.equal(equalRoleMemberships([second, second, first], expected), true)
  assert.equal(equalRoleMemberships([first, first], expected), false)
  assert.equal(equalRoleMemberships([second], expected), false)
  const actual = [second, first, first]
  const before = structuredClone(actual)
  assert.equal(equalRoleMemberships(actual, expected), true)
  assert.deepEqual(actual, before)
  for (const key of ['role', 'member', 'admin_option', 'inherit_option', 'set_option']) {
    const value = typeof first[key] === 'boolean' ? !first[key] : `${first[key]}_changed`
    assert.equal(
      equalRoleMemberships([{ ...first, [key]: value }, second, first], expected),
      false,
    )
  }
  assert.equal(
    equalRoleMemberships([{ ...first, unexpected: true }, second, first], expected),
    false,
  )
  assert.deepEqual(expected, [first, second, first])
})

const execute = promisify(execFile)
const postgresImage = 'public.ecr.aws/supabase/postgres:17.6.1.143'
const nodeImage = 'node:22-bookworm-slim'
const labelKey = 'stardust.drizzle.operational-test'
const manifest = JSON.parse(await readFile(defaultManifestPath, 'utf8'))
const guideId = '97931275-f72b-449b-8728-34c27d420c7f'
const guideInsert = `INSERT INTO public.guides(id,title,position,content,category) VALUES ('${guideId}','Operational adoption fixture',1,'Content preserved through access transition','lsp')`

function localEnvironment() {
  process.loadEnvFile(resolve(projectRoot, '.env.local'))
  const password = process.env.SUPABASE_DATABASE_PASSWORD
  assert.ok(password, 'Root local database password is required')
  const url = new URL(
    `postgresql://postgres:${encodeURIComponent(password)}@127.0.0.1:5432/postgres`,
  )
  url.searchParams.set('sslmode', 'disable')
  return {
    ...process.env,
    POSTGRES_PASSWORD: password,
    DATABASE_URL: url.toString(),
  }
}

function sanitized(text, environment) {
  return String(text)
    .replaceAll(environment.DATABASE_URL, '[database URL]')
    .replaceAll(environment.SUPABASE_DATABASE_PASSWORD, '[password]')
}

async function command(args, environment, input, timeout = 60000) {
  try {
    const child = spawn('docker', args, {
      cwd: projectRoot,
      env: environment,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    let stdout = '',
      stderr = ''
    child.stdout.on('data', (value) => {
      stdout += value
    })
    child.stderr.on('data', (value) => {
      stderr += value
    })
    child.stdin.end(input)
    const timer = setTimeout(() => child.kill('SIGKILL'), timeout)
    try {
      const code = await new Promise((fulfill, reject) => {
        child.once('error', reject)
        child.once('close', (exitCode, signal) => fulfill(signal ? -1 : exitCode))
      })
      return {
        code,
        stdout: sanitized(stdout, environment),
        stderr: sanitized(stderr, environment),
      }
    } finally {
      clearTimeout(timer)
    }
  } catch {
    throw new Error('Owned container command failed')
  }
}

export async function withOwnedClone(operation, { legacy = false } = {}) {
  const environment = localEnvironment()
  const identity = randomUUID()
  const name = `stardust-drizzle-test-${identity}`
  const directory = await mkdtemp(resolve(tmpdir(), 'stardust-builder-database-runtime-'))
  const runnerNames = new Set()
  const sql = async (text, { allowFailure = false, user = 'supabase_admin' } = {}) => {
    const result = await command(
      [
        'exec',
        '-i',
        '--env',
        'SUPABASE_DATABASE_PASSWORD',
        name,
        'psql',
        '-U',
        user,
        '-d',
        'postgres',
        '-At',
        '-v',
        'ON_ERROR_STOP=1',
      ],
      environment,
      text,
    )
    if (!allowFailure) assert.equal(result.code, 0, 'Owned fixture SQL must succeed')
    return result
  }
  const nodeArguments = (code, overlays = [], runnerName) => {
    const actualName = runnerName ?? `stardust-drizzle-runner-${randomUUID()}`
    runnerNames.add(actualName)
    return [
      'run',
      '--rm',
      '--name',
      actualName,
      '--label',
      `${labelKey}=${identity}`,
      '--network',
      `container:${name}`,
      '--mount',
      `type=bind,src=${projectRoot},dst=/workspace,readonly`,
      '--mount',
      `type=bind,src=${directory},dst=/fixture`,
      ...overlays,
      '--workdir',
      '/workspace',
      '--env',
      'DATABASE_URL',
      '--env',
      'SUPABASE_DATABASE_PASSWORD',
      nodeImage,
      'node',
      '--import',
      '/workspace/node_modules/tsx/dist/loader.mjs',
      '--input-type=module',
      '-e',
      code,
    ]
  }
  const invoke = (script, phase = 'legacy', extra = [], overlays = []) => {
    const options = {
      environment: 'local',
      manifestPath:
        '/workspace/apps/server/src/database/drizzle/legacy-schema-manifest.json',
      phase,
    }
    const entry =
      script === 'migrate'
        ? '/workspace/apps/server/scripts/migrate-database.ts'
        : script === 'adopt'
          ? '/workspace/scripts/adopt-drizzle-baseline.mjs'
          : '/workspace/scripts/check-drizzle-transition.mjs'
    const operation =
      script === 'migrate'
        ? `await api.migrateDatabase(options, ${extra.includes('--rollback')})`
        : script === 'adopt'
          ? 'console.log(JSON.stringify(await api.adoptBaseline(options)))'
          : 'const result=await api.checkTransition(options); console.log(JSON.stringify(result)); if(!result.compatible)process.exitCode=1'
    const code = `const options=${JSON.stringify(options)}; try {const api=await import(${JSON.stringify(entry)});${operation}}catch(error){
      const known=['Nonempty database requires verified baseline adoption','Database is incompatible with migration','Migrated catalog differs from server-owned state','Database is incompatible with baseline adoption','Database transition lock timed out','Database session was lost','Rollback migration hash differs','Restored catalog differs from adopted state'];
      const errors=[];let cause=error;while(cause){errors.push({name:cause.name,code:cause.code??null,knownMessage:known.includes(cause.message)?cause.message:null});cause=cause.cause}
      console.error(JSON.stringify({operationError:errors}));process.exitCode=1}`
    return command(nodeArguments(code, overlays), environment)
  }
  const invokeEntrypoint = (script, phase, extra = [], applicationName) => {
    const entry =
      script === 'migrate'
        ? '/workspace/apps/server/scripts/migrate-database.ts'
        : script === 'adopt'
          ? '/workspace/scripts/adopt-drizzle-baseline.mjs'
          : '/workspace/scripts/check-drizzle-transition.mjs'
    const args = nodeArguments('')
    args.splice(-3, 3, entry, '--environment', 'local', '--phase', phase, ...extra)
    const url = new URL(environment.DATABASE_URL)
    if (applicationName) url.searchParams.set('application_name', applicationName)
    return command(args, { ...environment, DATABASE_URL: url.toString() })
  }
  const snapshot = async () => {
    const args =
      nodeArguments(`import {captureCatalog,withTransitionSession,readTransitionLedger} from '/workspace/scripts/check-drizzle-transition.mjs';
      await withTransitionSession({environment:'local',manifestPath:'/workspace/apps/server/src/database/drizzle/legacy-schema-manifest.json',phase:'legacy'},async client=>console.log(JSON.stringify({catalog:await captureCatalog(client),ledger:await readTransitionLedger(client)})),false)`)
    const result = await command(args, environment)
    assert.equal(result.code, 0, 'Read-only fixture snapshot must succeed')
    return result.stdout.trim()
  }
  const launchSession = async (body) => {
    const runnerName = `stardust-drizzle-session-${randomUUID()}`
    const code = `import {withTransitionSession} from '/workspace/scripts/check-drizzle-transition.mjs';
      const options={environment:'local',manifestPath:'/workspace/apps/server/src/database/drizzle/legacy-schema-manifest.json',phase:'server-owned'};
      try {await withTransitionSession(options,async(client,assertSession)=>{${body}})}catch{console.error('Session operation failed');process.exitCode=1}`
    const completion = command(
      nodeArguments(code, [], runnerName),
      environment,
      undefined,
      45000,
    )
    let pid
    for (let attempt = 0; attempt < 150; attempt++) {
      const result = await sql(
        `SELECT pid FROM pg_locks WHERE locktype='advisory' AND granted ORDER BY pid LIMIT 1`,
      )
      if (result.stdout.trim()) {
        pid = Number(result.stdout.trim())
        break
      }
      await delay(100)
    }
    assert.ok(pid, 'Session must acquire its real advisory lock')
    return {
      pid,
      completion,
      async signal(signal = 'SIGTERM') {
        const result = await command(
          ['kill', '--signal', signal, runnerName],
          environment,
        )
        assert.equal(result.code, 0, 'Owned session signal must be delivered')
      },
    }
  }
  const fixture = {
    name,
    identity,
    directory,
    environment,
    sql,
    invoke,
    invokeEntrypoint,
    snapshot,
    launchSession,
    nodeArguments,
    guideId,
    guideInsert,
    async ledger() {
      return (
        await sql(
          `SELECT coalesce(json_agg(t ORDER BY created_at,id),'[]'::json) FROM drizzle.__drizzle_migrations t`,
        )
      ).stdout.trim()
    },
    async guide() {
      return (
        await sql(`SELECT row_to_json(g) FROM public.guides g WHERE id='${guideId}'`)
      ).stdout.trim()
    },
    async assertUnlocked() {
      assert.equal(
        (
          await sql(`SELECT count(*) FROM pg_locks WHERE locktype='advisory' AND granted`)
        ).stdout.trim(),
        '0',
      )
    },
  }
  try {
    const launched = await command(
      [
        'run',
        '-d',
        '--name',
        name,
        '--label',
        `${labelKey}=${identity}`,
        '--tmpfs',
        '/var/lib/postgresql/data',
        '--env',
        'POSTGRES_PASSWORD',
        postgresImage,
      ],
      environment,
    )
    assert.equal(launched.code, 0, 'Owned database container must start')
    let ready = false
    for (let attempt = 0; attempt < 150; attempt++) {
      const check = await command(
        [
          'exec',
          name,
          'pg_isready',
          '-h',
          '127.0.0.1',
          '-p',
          '5432',
          '-U',
          'supabase_admin',
          '-d',
          'postgres',
        ],
        environment,
      )
      if (check.code === 0) {
        ready = true
        break
      }
      await delay(200)
    }
    assert.ok(ready, 'Owned database must become ready')
    // Bootstrap uses the same versioned role and storage scripts as the local stack.
    // Remaining Auth/extension infrastructure is supplied by the pinned image.
    await sql(
      await readFile(resolve(projectRoot, 'docker/supabase/init/roles.sql'), 'utf8'),
    )
    await sql(
      'GRANT USAGE, CREATE ON SCHEMA public TO postgres; CREATE EXTENSION IF NOT EXISTS pgaudit WITH SCHEMA extensions;',
    )
    // Fresh Supabase images seed schema-specific application defaults. Revoke only
    // the observed public defaults; GLOBAL/Auth/storage/extension defaults remain intact.
    for (const owner of ['postgres', 'supabase_admin']) {
      for (const kind of ['TABLES', 'SEQUENCES', 'FUNCTIONS']) {
        await sql(
          `ALTER DEFAULT PRIVILEGES FOR ROLE ${owner} IN SCHEMA public REVOKE ALL PRIVILEGES ON ${kind} FROM postgres, anon, authenticated, service_role`,
        )
      }
    }
    await sql(
      await readFile(
        resolve(projectRoot, 'docker/supabase/init/storage-compatibility.sql'),
        'utf8',
      ),
    )
    await sql('ALTER TABLE storage.objects OWNER TO postgres;')
    await sql(
      'CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public; CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;',
    )
    if (legacy) await prepareLegacyCli(fixture)
    return await operation(fixture)
  } finally {
    try {
      // A killed Docker CLI does not guarantee that its --rm container stopped.
      // Every runner is named and checked before removal, including timeout/signal paths.
      for (const runnerName of runnerNames) {
        const inspected = await command(
          ['inspect', '--format', `{{index .Config.Labels "${labelKey}"}}`, runnerName],
          environment,
        )
        if (inspected.code !== 0) continue
        assert.equal(
          inspected.stdout.trim(),
          identity,
          'Runner cleanup requires its exact owned label',
        )
        const removed = await command(['rm', '-f', runnerName], environment)
        assert.equal(removed.code, 0, 'Owned runner cleanup must succeed')
      }
    } finally {
      try {
        const inspected = await command(
          ['inspect', '--format', `{{index .Config.Labels "${labelKey}"}}`, name],
          environment,
        )
        if (inspected.code === 0) {
          assert.equal(
            inspected.stdout.trim(),
            identity,
            'Database cleanup requires its exact owned label',
          )
          const removed = await command(['rm', '-f', name], environment)
          assert.equal(removed.code, 0, 'Owned database cleanup must succeed')
        }
      } finally {
        assert.equal(
          dirname(directory),
          tmpdir(),
          'Temporary cleanup requires a direct owned tempdir',
        )
        assert.ok(
          basename(directory).startsWith('stardust-builder-database-runtime-'),
          'Temporary cleanup requires the owned fixture prefix',
        )
        const cleanupName = `stardust-drizzle-cleanup-${randomUUID()}`
        try {
          const cleaned = await command(
            [
              'run',
              '--rm',
              '--name',
              cleanupName,
              '--label',
              `${labelKey}=${identity}`,
              '--network',
              'none',
              '--mount',
              `type=bind,src=${directory},dst=/fixture`,
              nodeImage,
              'node',
              '-e',
              "const fs=require('node:fs');for(const entry of fs.readdirSync('/fixture'))fs.rmSync('/fixture/'+entry,{recursive:true,force:true})",
            ],
            environment,
          )
          assert.equal(cleaned.code, 0, 'Owned temporary contents cleanup must succeed')
        } finally {
          const inspected = await command(
            [
              'inspect',
              '--format',
              `{{index .Config.Labels "${labelKey}"}}`,
              cleanupName,
            ],
            environment,
          )
          if (inspected.code === 0) {
            assert.equal(
              inspected.stdout.trim(),
              identity,
              'Cleanup runner requires its exact owned label',
            )
            const removed = await command(['rm', '-f', cleanupName], environment)
            assert.equal(removed.code, 0, 'Cleanup runner must be removed')
          }
          await rm(directory, { recursive: true, force: true })
        }
      }
    }
  }
}

async function prepareLegacyCli(fixture) {
  const folder = resolve(fixture.directory, 'supabase/migrations')
  await mkdir(folder, { recursive: true })
  for (const migration of manifest.sourceMigrations) {
    const source = await execute(
      'git',
      [
        'show',
        `${manifest.sourceCommit}:apps/server/supabase/migrations/${migration.name}`,
      ],
      { cwd: projectRoot, maxBuffer: 8 * 1024 * 1024 },
    )
    await writeFile(resolve(folder, migration.name), source.stdout)
  }
  const config = await execute(
    'git',
    ['show', `${manifest.sourceCommit}:apps/server/supabase/config.toml`],
    { cwd: projectRoot },
  )
  await writeFile(resolve(fixture.directory, 'supabase/config.toml'), config.stdout)
  const code = `import {spawnSync} from 'node:child_process';process.loadEnvFile('/workspace/.env.local');
    const result=spawnSync(process.execPath,['/workspace/apps/server/node_modules/supabase/dist/supabase.js','migration','up','--db-url',process.env.DATABASE_URL,'--include-all'],{cwd:'/fixture',env:process.env,encoding:'utf8'});
    if(result.status!==0){
      const output=(result.stdout??'')+(result.stderr??'');
      const known=['failed to connect','permission denied','does not exist','already exists','password authentication failed','server refused TLS connection','connection refused','context deadline exceeded','invalid connection','missing environment variable','failed to parse config'];
      console.error(JSON.stringify({legacyCliError:{exit:result.status,name:result.error?.name??null,code:result.error?.code??null,knownMessages:known.filter(message=>output.toLowerCase().includes(message)),sqlStates:Array.from(output.matchAll(/SQLSTATE ([A-Z0-9]{5})/g),match=>match[1])}}));process.exitCode=1}`
  const result = await command(
    fixture.nodeArguments(code),
    fixture.environment,
    undefined,
    120000,
  )
  assert.equal(
    result.code,
    0,
    'Real CLI must replay all 24 legacy migrations and write its own history',
  )
  const actual = await fixture.sql(
    'SELECT version,name FROM supabase_migrations.schema_migrations ORDER BY version',
  )
  assert.equal(
    actual.stdout.trim().split('\n').length,
    24,
    'CLI history must contain the 24 genuine entries',
  )
}

if (isMain(import.meta.url)) {
  test('real entrypoints validate help and arguments before manifest, environment or connection', {
    timeout: 120000,
  }, async () => {
    let connections = 0
    const sentinel = createServer((socket) => {
      connections++
      socket.destroy()
    })
    await new Promise((fulfill, reject) => {
      sentinel.once('error', reject)
      sentinel.listen(0, '127.0.0.1', fulfill)
    })
    try {
      const address = sentinel.address()
      assert.ok(address && typeof address === 'object')
      const environment = {
        ...process.env,
        DATABASE_URL: `postgresql://127.0.0.1:${address.port}/postgres`,
      }
      const entries = [
        'scripts/check-drizzle-transition.mjs',
        'scripts/adopt-drizzle-baseline.mjs',
        'apps/server/scripts/migrate-database.ts',
      ]
      for (const entry of entries) {
        const run = async (args) => {
          try {
            const result = await execute(
              process.execPath,
              ['--import', 'tsx', resolve(projectRoot, entry), ...args],
              { cwd: projectRoot, env: environment, timeout: 15000 },
            )
            return { code: 0, ...result }
          } catch (error) {
            return { code: error.code, stdout: error.stdout, stderr: error.stderr }
          }
        }
        const help = await run([
          '--help',
          '--manifest',
          '/nonexistent-transition-sentinel.json',
        ])
        assert.equal(help.code, 0)
        assert.match(help.stdout, /^Usage:/)
        const invalid = [
          ['--unknown'],
          ['positional'],
          ['--phase'],
          ['--manifest'],
          ['--environment'],
          ['--phase', '--help'],
          ['--phase', 'invalid'],
          ['--environment', 'invalid'],
          ['--help', '--help'],
          ['--phase', 'legacy', '--phase', 'legacy'],
          ['--manifest', 'a', '--manifest', 'b'],
          ['--environment', 'local', '--environment', 'local'],
        ]
        if (!entry.endsWith('migrate-database.ts')) invalid.push(['--rollback'])
        else invalid.push(['--rollback', '--rollback'])
        for (const args of invalid) {
          const result = await run(args)
          assert.equal(result.code, 1)
          assert.match(result.stderr, /^Database command failed:/)
        }
        const noEnvironment = await execute(
          process.execPath,
          ['--import', 'tsx', resolve(projectRoot, entry), '--help'],
          { cwd: projectRoot, env: { PATH: process.env.PATH }, timeout: 15000 },
        )
        assert.match(noEnvironment.stdout, /^Usage:/)
      }
      assert.equal(
        connections,
        0,
        'Parser/help must never connect to the database sentinel',
      )
    } finally {
      await new Promise((fulfill, reject) =>
        sentinel.close((error) => (error ? reject(error) : fulfill())),
      )
    }
  })

  test('empty migrate establishes exact server-owned catalog, no-op and denied external roles', {
    timeout: 180000,
  }, async () => {
    await withOwnedClone(async (fixture) => {
      assert.equal(
        (await fixture.invoke('check', 'legacy')).code,
        1,
        'Empty must never pass legacy preflight',
      )
      assert.equal(
        (await fixture.invoke('adopt', 'legacy')).code,
        1,
        'Empty cannot be adopted',
      )
      assert.equal(
        (
          await fixture.sql(`SELECT to_regclass('drizzle.__drizzle_migrations') IS NULL`)
        ).stdout.trim(),
        't',
      )
      assert.equal((await fixture.invoke('migrate')).code, 0)
      assert.equal((await fixture.invoke('check', 'server-owned')).code, 0)
      const before = await fixture.ledger()
      assert.equal((await fixture.invoke('migrate')).code, 0)
      assert.equal(await fixture.ledger(), before)
      await fixture.sql(fixture.guideInsert)
      for (const role of ['anon', 'authenticated']) {
        const denied = await fixture.sql(
          `SET ROLE ${role}; SELECT title FROM public.guides`,
          { allowFailure: true },
        )
        assert.notEqual(denied.code, 0, `${role} SELECT must fail on the real database`)
        const deniedFunction = await fixture.sql(
          `SET ROLE ${role}; SELECT public.slugify('fixture')`,
          { allowFailure: true },
        )
        assert.notEqual(
          deniedFunction.code,
          0,
          `${role} EXECUTE must fail on an own function`,
        )
      }
      assert.equal(
        (
          await fixture.sql('SET ROLE service_role; SELECT count(*) FROM public.guides')
        ).stdout
          .trim()
          .split('\n')
          .at(-1),
        '1',
      )
      assert.equal(
        (
          await fixture.sql(
            `SELECT has_function_privilege('anon','auth.uid()','EXECUTE'), has_function_privilege('authenticated','auth.uid()','EXECUTE')`,
          )
        ).stdout.trim(),
        't|t',
      )
      await fixture.assertUnlocked()
    })
  })

  test('partial/hash/phase drift and unknown application objects fail without changing ledger or data', {
    timeout: 180000,
  }, async () => {
    await withOwnedClone(async (fixture) => {
      assert.equal((await fixture.invoke('migrate')).code, 0)
      await fixture.sql(fixture.guideInsert)
      const guide = await fixture.guide()
      assert.equal((await fixture.invoke('check', 'adopted')).code, 1)
      assert.equal(await fixture.guide(), guide)
      await fixture.sql(
        `UPDATE drizzle.__drizzle_migrations SET hash='wrong-hash' WHERE created_at=(SELECT max(created_at) FROM drizzle.__drizzle_migrations)`,
      )
      let before = await fixture.ledger()
      assert.equal((await fixture.invoke('migrate')).code, 1)
      assert.equal((await fixture.invoke('adopt', 'server-owned')).code, 1)
      assert.equal(await fixture.ledger(), before)
      await fixture.sql(
        'DELETE FROM drizzle.__drizzle_migrations WHERE created_at=(SELECT min(created_at) FROM drizzle.__drizzle_migrations)',
      )
      before = await fixture.ledger()
      assert.equal((await fixture.invoke('migrate')).code, 1)
      assert.equal(await fixture.ledger(), before)
      await fixture.sql('CREATE TABLE public.unrepresented_probe(id integer)')
      before = await fixture.ledger()
      assert.equal((await fixture.invoke('check', 'server-owned')).code, 1)
      assert.equal((await fixture.invoke('migrate')).code, 1)
      assert.equal(await fixture.ledger(), before)
      assert.equal(await fixture.guide(), guide)
      assert.equal(
        (
          await fixture.sql(
            `SELECT to_regclass('public.unrepresented_probe') IS NOT NULL`,
          )
        ).stdout.trim(),
        't',
      )
    })
  })

  test('lock timeout, signal and lost session reject queued writes and release the real lock', {
    timeout: 240000,
  }, async () => {
    await withOwnedClone(async (fixture) => {
      assert.equal((await fixture.invoke('migrate')).code, 0)
      const before = await fixture.ledger()
      const holder = await fixture.launchSession(
        `await client.unsafe('SELECT pg_sleep(30)')`,
      )
      const start = Date.now()
      const timedOut = await fixture.invoke('migrate')
      assert.equal(timedOut.code, 1)
      assert.ok(Date.now() - start < 20000, 'Lock timeout must be bounded')
      assert.equal(await fixture.ledger(), before)
      await holder.signal()
      assert.notEqual((await holder.completion).code, 0)
      await fixture.assertUnlocked()
      const lost = await fixture.launchSession(
        `await new Promise(resolve=>setTimeout(resolve,2000)); await client.unsafe(${JSON.stringify(guideInsert)})`,
      )
      await fixture.sql(`SELECT pg_terminate_backend(${lost.pid})`)
      const failed = await lost.completion
      assert.notEqual(failed.code, 0, 'Connection loss must fail the operation')
      assert.equal(
        (
          await fixture.sql(`SELECT count(*) FROM public.guides WHERE id='${guideId}'`)
        ).stdout.trim(),
        '0',
        'No write may reconnect after losing the lock session',
      )
      assert.equal(await fixture.ledger(), before)
      await fixture.assertUnlocked()
      assert.equal(
        (await fixture.invoke('migrate')).code,
        0,
        'A fresh operation can obtain the released lock',
      )
      assert.match(advisoryLockKey, /^\d+$/)
    })
  })
}
