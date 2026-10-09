import assert from 'node:assert/strict'
import { test } from 'node:test'
import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { resolve } from 'node:path'
import { withOwnedClone } from './check-drizzle-transition.test.mjs'

test('real legacy CLI history and populated data adopt atomically, concurrent adoption is idempotent', {
  timeout: 240000,
}, async () => {
  await withOwnedClone(
    async (fixture) => {
      assert.equal((await fixture.invoke('check', 'legacy')).code, 0)
      await fixture.sql(fixture.guideInsert)
      const guide = await fixture.guide()
      const history = (
        await fixture.sql(
          'SELECT json_agg(t ORDER BY version) FROM supabase_migrations.schema_migrations t',
        )
      ).stdout.trim()
      const results = await Promise.all([
        fixture.invoke('adopt', 'legacy'),
        fixture.invoke('adopt', 'legacy'),
      ])
      assert.equal(
        results.filter((result) => result.code === 0).length,
        1,
        'Only one legacy-phase adopter may write the ledger',
      )
      assert.equal(JSON.parse(await fixture.ledger()).length, 2)
      assert.equal(await fixture.guide(), guide)
      assert.equal((await fixture.invoke('check', 'adopted')).code, 0)
      const ledger = await fixture.ledger()
      assert.equal((await fixture.invoke('adopt', 'adopted')).code, 0)
      assert.equal(await fixture.ledger(), ledger)
      assert.equal((await fixture.invoke('migrate')).code, 0)
      assert.equal((await fixture.invoke('adopt', 'server-owned')).code, 0)
      assert.equal(await fixture.guide(), guide)
      assert.equal(
        (
          await fixture.sql(
            'SELECT json_agg(t ORDER BY version) FROM supabase_migrations.schema_migrations t',
          )
        ).stdout.trim(),
        history,
      )
      await fixture.assertUnlocked()
    },
    { legacy: true },
  )
})

test('legacy extra history and schema drift reject adoption with no ledger writes', {
  timeout: 240000,
}, async () => {
  await withOwnedClone(
    async (fixture) => {
      await fixture.sql(fixture.guideInsert)
      const guide = await fixture.guide()
      await fixture.sql(
        `INSERT INTO supabase_migrations.schema_migrations(version,name,statements) VALUES ('99999999999999','unrepresented_history',ARRAY['SELECT 1'])`,
      )
      assert.equal((await fixture.invoke('check', 'legacy')).code, 1)
      assert.equal((await fixture.invoke('adopt', 'legacy')).code, 1)
      assert.equal(
        (
          await fixture.sql(`SELECT to_regclass('drizzle.__drizzle_migrations') IS NULL`)
        ).stdout.trim(),
        't',
      )
      assert.equal(await fixture.guide(), guide)
      await fixture.sql(
        `DELETE FROM supabase_migrations.schema_migrations WHERE version='99999999999999'; CREATE TABLE public.unrepresented_probe(id integer)`,
      )
      assert.equal((await fixture.invoke('adopt', 'legacy')).code, 1)
      assert.equal(
        (
          await fixture.sql(`SELECT to_regclass('drizzle.__drizzle_migrations') IS NULL`)
        ).stdout.trim(),
        't',
      )
      assert.equal(await fixture.guide(), guide)
      await fixture.assertUnlocked()
    },
    { legacy: true },
  )
})

test('rollback checks inverse hash, restores legacy access/defaults without data loss, and permits remigration', {
  timeout: 240000,
}, async () => {
  await withOwnedClone(async (fixture) => {
    assert.equal((await fixture.invoke('migrate')).code, 0)
    await fixture.sql(fixture.guideInsert)
    const guide = await fixture.guide(),
      before = await fixture.ledger()
    const badInverse = resolve(fixture.directory, 'bad-inverse.sql')
    await writeFile(badInverse, 'SELECT 1;\n')
    const overlay = [
      '--mount',
      `type=bind,src=${badInverse},dst=/workspace/apps/server/src/database/drizzle/rollback/0002_server_owned_access.sql,readonly`,
    ]
    assert.equal(
      (await fixture.invoke('migrate', 'server-owned', ['--rollback'], overlay)).code,
      1,
    )
    assert.equal(await fixture.ledger(), before)
    assert.equal(await fixture.guide(), guide)
    assert.equal(
      (await fixture.invoke('migrate', 'server-owned', ['--rollback'])).code,
      0,
    )
    const adopted = await fixture.ledger()
    assert.equal(JSON.parse(adopted).length, 2)
    assert.equal((await fixture.invoke('check', 'adopted')).code, 0)
    assert.equal(
      (
        await fixture.sql(
          "SELECT count(*) FROM pg_default_acl WHERE defaclnamespace=0 OR defaclnamespace='public'::regnamespace",
        )
      ).stdout.trim(),
      '0',
      'Default ACL must return to the captured implicit default',
    )
    assert.equal(
      (await fixture.sql('SET ROLE anon; SELECT count(*) FROM public.guides')).stdout
        .trim()
        .split('\n')
        .at(-1),
      '1',
    )
    assert.equal((await fixture.invoke('migrate', 'adopted', ['--rollback'])).code, 0)
    assert.equal(await fixture.ledger(), adopted)
    assert.equal(await fixture.guide(), guide)
    assert.equal((await fixture.invoke('migrate')).code, 0)
    assert.equal((await fixture.invoke('check', 'server-owned')).code, 0)
    assert.equal(await fixture.guide(), guide)
    await fixture.assertUnlocked()
  })
})

test('mixed real CLI adopt migrate rollback serialize across all transition phases', {
  timeout: 300000,
}, async () => {
  await withOwnedClone(
    async (fixture) => {
      await fixture.sql(fixture.guideInsert)
      const guide = await fixture.guide()
      const history = (
        await fixture.sql(
          'SELECT json_agg(t ORDER BY version) FROM supabase_migrations.schema_migrations t',
        )
      ).stdout.trim()
      for (const phase of ['legacy', 'adopted', 'server-owned']) {
        if (phase === 'adopted') {
          const ledger = JSON.parse(await fixture.snapshot()).ledger
          if (ledger.length === 0)
            assert.equal((await fixture.invoke('adopt', 'legacy')).code, 0)
          else if (ledger.length === 3)
            assert.equal(
              (await fixture.invoke('migrate', 'server-owned', ['--rollback'])).code,
              0,
            )
        }
        if (phase === 'server-owned')
          assert.equal((await fixture.invoke('migrate')).code, 0)
        assert.equal((await fixture.invoke('check', phase)).code, 0)
        const before = await fixture.snapshot()
        const holder = await fixture.launchSession('await new Promise(()=>{});')
        const names = ['adopt', 'migrate', 'rollback'].map(
          (operation) => `transition-${phase}-${operation}`,
        )
        let settled = 0
        const operations = [
          fixture.invokeEntrypoint('adopt', phase, [], names[0]),
          fixture.invokeEntrypoint('migrate', phase, [], names[1]),
          fixture.invokeEntrypoint('migrate', phase, ['--rollback'], names[2]),
        ].map((operation) =>
          operation.finally(() => {
            settled++
          }),
        )
        try {
          let visible = false
          for (let attempt = 0; attempt < 70; attempt++) {
            const result = await fixture.sql(
              `SELECT count(*) FROM pg_stat_activity WHERE application_name IN ('${names.join("','")}')`,
            )
            if (result.stdout.trim() === '3') {
              visible = true
              break
            }
            await delay(100)
          }
          assert.ok(
            visible,
            'All three polling contenders must own observable live sessions',
          )
          assert.equal(
            settled,
            0,
            'No operation may finish while the holder owns the lock',
          )
          assert.ok(
            (await fixture.snapshot()) === before,
            'Catalog and ledger must remain unchanged while all contenders are blocked',
          )
          assert.ok(
            (await fixture.guide()) === guide,
            'Populated data must remain unchanged before unlock',
          )
        } finally {
          await holder.signal()
          await holder.completion
        }
        const results = await Promise.all(operations)
        assert.ok(results.every((result) => result.code === 0 || result.code === 1))
        const after = JSON.parse(await fixture.snapshot())
        const finalPhase =
          after.ledger.length === 0
            ? 'legacy'
            : after.ledger.length === 2
              ? 'adopted'
              : 'server-owned'
        assert.ok(
          [0, 2, 3].includes(after.ledger.length),
          'Serialized operations may only leave a complete known ledger',
        )
        assert.equal(
          (await fixture.invoke('check', finalPhase)).code,
          0,
          'Final catalog and exact hashes must match the serialized phase',
        )
        assert.ok((await fixture.guide()) === guide)
        assert.ok(
          (
            await fixture.sql(
              'SELECT json_agg(t ORDER BY version) FROM supabase_migrations.schema_migrations t',
            )
          ).stdout.trim() === history,
        )
        await fixture.assertUnlocked()
      }
    },
    { legacy: true },
  )
})
