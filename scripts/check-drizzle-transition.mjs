import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import postgres from 'postgres'
import { readMigrationFiles } from 'drizzle-orm/migrator'

/** @typedef {{environment:'local'|'dev'|'prod',manifestPath:string,phase:'legacy'|'adopted'|'server-owned'}} TransitionOptions */
export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const migrationsFolder = resolve(
  projectRoot,
  'apps/server/src/database/drizzle/migrations',
)
export const defaultManifestPath = resolve(
  projectRoot,
  'apps/server/src/database/drizzle/legacy-schema-manifest.json',
)
export const advisoryLockKey = '7531462901845273'
const frozenSources = [
  {
    name: '20251008214302_create_tables.sql',
    sha256: '64aa1099a177230b645aaacd24c878da8e59a6ef36e365f002d8ce69ee66ad2f',
  },
  {
    name: '20260506130000_create_insignias_tables.sql',
    sha256: '14b9ade4983eb3bec71645bc8b8891578296eb945477c6e828e8d4d33015ea9e',
  },
  {
    name: '20260508132253_create_notes.sql',
    sha256: '26f4044c6eee8476164273e5057d522bd95d4194c54597c7cda86de27049bd8e',
  },
  {
    name: '20260511182355_remote_schema.sql',
    sha256: 'f88e62ae2de61470e77182e7d41609fcfb26b6cbd78663db5483c5db919bec31',
  },
  {
    name: '20260511184731_remote_schema.sql',
    sha256: 'fe6f7fc36e9e91a321cff7fdbeeb08f51d10f3c6930ed340fcde78279fc6a6f3',
  },
  {
    name: '20260511210000_remove_next_star_function_and_view.sql',
    sha256: 'c953b4adbc7d1fc0f787d6c7dd1983bbf6a3b4243c6b552d0681b9ddd4fc8e63',
  },
  {
    name: '20260514120000_create_update_text_block_audio_function.sql',
    sha256: 'b55ee779502a82c71e9fc3cb7e2a024f4b04cf2c7af88ffcdfb07be2e81f167c',
  },
  {
    name: '20260603120000_create_clear_text_block_audio_function.sql',
    sha256: '71ee4441feb7e37d7ae597b454ef5f18c65f1cd6742806979a5e59f8796e47dc',
  },
  {
    name: '20260611120000_grant_select_on_public_views.sql',
    sha256: '29856ae15494203b70efe2b45ebf6d528c861daef289808ceaf8031ab760cc1b',
  },
  {
    name: '20260611130000_drop_users_visits.sql',
    sha256: '915c29d84495ef757d3fd516ddf54bc3a9a7253c54e10eb22724a894d0aa4898',
  },
  {
    name: '20260619120000_rename_challenges_code_to_initial_code.sql',
    sha256: '632433d7f6de1994ddb9709d26cf149686e2b1d4d9ec628a91dc6b7b03c8096c',
  },
  {
    name: '20260619123000_update_challenges_view_and_list_function_to_initial_code.sql',
    sha256: 'efd11bd93f8bb06867fd7d0dde141ab97a549f7c4702421ff5ca231545200ad3',
  },
  {
    name: '20260716120000_add_challenge_is_evaluated_by_function.sql',
    sha256: '7fe71e1edde1c456346bbb4e52bfa6d4f72ad3b34103c23031caeb03f19e999d',
  },
  {
    name: '20260716121000_create_challenge_code_executions.sql',
    sha256: '7cfaba6cdab4dccd1e124026bc6acdc26fefe22cf69e3ff34e310403d085ef86',
  },
  {
    name: '20260723120000_add_challenge_official_solution.sql',
    sha256: 'fb049aaa7d7c817e38a4a35d592897e9e2342eff1461ae80b8205dd73173b759',
  },
  {
    name: '20260804120000_create_feedback_conversations.sql',
    sha256: 'bdbc5363a3b09f1d8a39b467de317693982f501f0c57f35e1a4907fc1c38aa55',
  },
  {
    name: '20260804130000_remove_feedback_outbox_events.sql',
    sha256: '2df83d5612fa9e7668ad6cb7b14d903e284f421ea6209c2099adb3d2a1ecdfa1',
  },
  {
    name: '20260804140000_remove_persist_feedback_message.sql',
    sha256: '565f3b1a5885e4ae80035fce0d5e5a18113d50f471f49564b74465ccea4d39ea',
  },
  {
    name: '20260804150000_grant_feedback_reporting_permissions.sql',
    sha256: '988627ce5713d9af6536666c768f09c39266aa2f84560bd0b1feb030e468e260',
  },
  {
    name: '20260806120000_add_user_feedback_history.sql',
    sha256: 'd6369e2ae95d7f5a89108439cd78a4a38cdb45ecb7233a2d6230d55eaf0cb29f',
  },
  {
    name: '20260807000058_revoke_feedback_history_public_execute.sql',
    sha256: '290afde48c20b5b2d7c3aa4469dcdb259afc8ce045479d6462c015e875f41ea0',
  },
  {
    name: '20260807000829_enable_feedback_author_insert_rls.sql',
    sha256: 'f638658c6b348b32a49107a8b5428fb3ba00714db2e57c971c1978075031dc7c',
  },
  {
    name: '20260807000901_enable_feedback_author_update_rls.sql',
    sha256: '0d876972b4b70b6cd8893d644fb262eb8a834b44d315042b4aba190cc788f341',
  },
  {
    name: '20260810100000_add_user_metadata_to_feedback_history.sql',
    sha256: 'bd39cfa09451003e5e6b21f975289148f57e8c3e29551e295555cec66ab5027b',
  },
]
const catalogQueries = {
  tables:
    "SELECT c.relname name,pg_get_userbyid(c.relowner) owner,c.relrowsecurity rls,c.relforcerowsecurity force_rls,c.reloptions options FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='r' ORDER BY 1",
  columns:
    "SELECT c.relname table_name,a.attname name,a.attnum position,format_type(a.atttypid,a.atttypmod) type,a.attnotnull not_null,pg_get_expr(d.adbin,d.adrelid) default_expression,a.attidentity identity,a.attgenerated generated FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum WHERE n.nspname='public' AND c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped ORDER BY 1,3",
  constraints:
    "SELECT c.relname table_name,k.conname name,k.contype type,pg_get_constraintdef(k.oid,true) definition,k.condeferrable deferrable,k.condeferred deferred,k.convalidated validated,(SELECT json_agg(a.attname ORDER BY u.ord) FROM unnest(k.conkey) WITH ORDINALITY u(num,ord) JOIN pg_attribute a ON a.attrelid=k.conrelid AND a.attnum=u.num) columns,tn.nspname target_schema,tc.relname target_table,(SELECT json_agg(a.attname ORDER BY u.ord) FROM unnest(k.confkey) WITH ORDINALITY u(num,ord) JOIN pg_attribute a ON a.attrelid=k.confrelid AND a.attnum=u.num) target_columns,k.confdeltype delete_action,k.confupdtype update_action FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_class tc ON tc.oid=k.confrelid LEFT JOIN pg_namespace tn ON tn.oid=tc.relnamespace WHERE n.nspname='public' ORDER BY 1,2",
  indexes:
    "SELECT c.relname table_name,ic.relname name,pg_get_indexdef(i.indexrelid) definition,i.indisunique is_unique,i.indisprimary is_primary,am.amname method,pg_get_expr(i.indpred,i.indrelid) predicate,(SELECT json_agg(pg_get_indexdef(i.indexrelid,j,true) ORDER BY j) FROM generate_series(1,i.indnatts)j) expressions,EXISTS(SELECT 1 FROM pg_constraint k WHERE k.conindid=i.indexrelid) constraint_backed FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_class ic ON ic.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_am am ON am.oid=ic.relam WHERE n.nspname='public' ORDER BY 1,2",
  enums:
    "SELECT t.typname name,json_agg(e.enumlabel ORDER BY e.enumsortorder) values FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace JOIN pg_enum e ON e.enumtypid=t.oid WHERE n.nspname='public' GROUP BY t.typname ORDER BY 1",
  sequences:
    "SELECT schemaname schema,sequencename name,sequenceowner owner,data_type type,start_value,min_value,max_value,increment_by,cycle,cache_size FROM pg_sequences WHERE schemaname='public' ORDER BY 2",
  views:
    "SELECT c.relname name,pg_get_userbyid(c.relowner) owner,c.reloptions options,pg_get_viewdef(c.oid,true) definition FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('v','m') ORDER BY 1",
  functions:
    "SELECT n.nspname schema,p.proname name,pg_get_function_identity_arguments(p.oid) arguments,p.prokind kind,pg_get_userbyid(p.proowner) owner,p.prosecdef security_definer,p.proconfig settings,pg_get_functiondef(p.oid) definition FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prokind IN ('f','p') AND NOT EXISTS(SELECT 1 FROM pg_depend d WHERE d.classid='pg_proc'::regclass AND d.objid=p.oid AND d.deptype='e') ORDER BY 2,3",
  triggers:
    "SELECT n.nspname schema,c.relname table_name,t.tgname name,t.tgenabled enabled,pg_get_triggerdef(t.oid,true) definition FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_proc p ON p.oid=t.tgfoid JOIN pg_namespace pn ON pn.oid=p.pronamespace WHERE NOT t.tgisinternal AND (n.nspname='public' OR pn.nspname='public') ORDER BY 1,2,3",
  policies:
    "SELECT schemaname schema,tablename table_name,policyname name,permissive,roles,cmd command,qual using_expression,with_check check_expression FROM pg_policies WHERE schemaname='public' OR (schemaname='storage' AND tablename='objects') ORDER BY 1,2,3",
  relationGrants:
    "SELECT n.nspname schema,c.relname name,c.relkind kind,pg_get_userbyid(c.relowner) owner,CASE WHEN a.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(a.grantee) END grantee,pg_get_userbyid(a.grantor) grantor,a.privilege_type privilege,a.is_grantable FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace CROSS JOIN LATERAL aclexplode(coalesce(c.relacl,acldefault(CASE WHEN c.relkind='S' THEN 'S'::\"char\" ELSE 'r'::\"char\" END,c.relowner)))a WHERE (n.nspname='public' AND c.relkind IN ('r','v','m','S')) OR (n.nspname='storage' AND c.relname='objects') ORDER BY 1,2,5,7",
  functionGrants:
    "SELECT n.nspname schema,p.proname name,pg_get_function_identity_arguments(p.oid) arguments,pg_get_userbyid(p.proowner) owner,CASE WHEN a.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(a.grantee) END grantee,pg_get_userbyid(a.grantor) grantor,a.privilege_type privilege,a.is_grantable FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace CROSS JOIN LATERAL aclexplode(coalesce(p.proacl,acldefault('f',p.proowner)))a WHERE n.nspname='public' AND NOT EXISTS(SELECT 1 FROM pg_depend d WHERE d.classid='pg_proc'::regclass AND d.objid=p.oid AND d.deptype='e') ORDER BY 1,2,3,5,7",
  defaultPrivileges:
    "SELECT pg_get_userbyid(d.defaclrole) owner,n.nspname schema,d.defaclobjtype object_type,CASE WHEN a.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(a.grantee) END grantee,pg_get_userbyid(a.grantor) grantor,a.privilege_type privilege,a.is_grantable FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace CROSS JOIN LATERAL aclexplode(d.defaclacl)a WHERE n.nspname='public' OR d.defaclnamespace=0 ORDER BY 1,2,3,4,6",
  roleMemberships:
    'SELECT pg_get_userbyid(roleid) role,pg_get_userbyid(member) member,admin_option,inherit_option,set_option FROM pg_auth_members ORDER BY 1,2',
  extensions:
    'SELECT e.extname name,e.extversion version,n.nspname schema FROM pg_extension e JOIN pg_namespace n ON n.oid=e.extnamespace ORDER BY 1',
}

export function loadTransitionManifest(path = defaultManifestPath) {
  const manifest = JSON.parse(readFileSync(resolve(projectRoot, path), 'utf8'))
  if (
    manifest.sourceCommit !== '8f9f71ac3dc4bd42312f5890f05c5da02c8814a9' ||
    JSON.stringify(manifest.sourceMigrations) !== JSON.stringify(frozenSources)
  )
    throw new Error('Manifest provenance differs from the frozen legacy source')
  if (!manifest.structure || !manifest.accessCatalogs || !manifest.accessTransformation)
    throw new Error('Manifest phase catalogs are missing')
  return manifest
}

export function transitionMigrations() {
  const journal = JSON.parse(
    readFileSync(resolve(migrationsFolder, 'meta/_journal.json'), 'utf8'),
  )
  const tags = ['0000_baseline', '0001_application_objects', '0002_server_owned_access']
  if (
    journal.version !== '7' ||
    journal.dialect !== 'postgresql' ||
    journal.entries.length !== 3 ||
    journal.entries.some(
      (entry, index) =>
        entry.idx !== index ||
        entry.tag !== tags[index] ||
        !entry.breakpoints ||
        !Number.isSafeInteger(entry.when) ||
        (index > 0 && entry.when <= journal.entries[index - 1].when),
    )
  )
    throw new Error('Unexpected migration journal')
  return readMigrationFiles({ migrationsFolder })
}

function validateOptions(options) {
  if (
    !['local', 'dev', 'prod'].includes(options.environment) ||
    !['legacy', 'adopted', 'server-owned'].includes(options.phase)
  )
    throw new Error('Invalid transition options')
  const url = process.env.SUPABASE_DATABASE_URL
  if (!url) throw new Error('SUPABASE_DATABASE_URL is required')
  const parsed = new URL(url)
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol))
    throw new Error('Invalid database protocol')
  if (
    options.environment === 'local' &&
    !['localhost', '127.0.0.1', '[::1]', '::1'].includes(parsed.hostname)
  )
    throw new Error('Local operations require a loopback database host')
  return url
}

/**
 * Every operation owns an exclusive one-connection client, including the ORM migrator.
 * @template T
 * @param {TransitionOptions} options
 * @param {(client: import('postgres').Sql, assertSession: () => Promise<void>) => Promise<T>} operation
 * @param {boolean} locked
 * @returns {Promise<T>}
 */
export async function withTransitionSession(options, operation, locked = true) {
  const url = validateOptions(options)
  let invalid = false,
    acquired = false,
    closing = false
  const client = postgres(url, {
    max: 1,
    idle_timeout: 0,
    max_lifetime: 0,
    connect_timeout: 10,
    fetch_types: false,
    onclose() {
      if (!closing) invalid = true
    },
    debug() {
      if (invalid) throw new Error('Database session was lost; reconnection is forbidden')
    },
  })
  const stop = () => {
    invalid = true
    void client.end({ timeout: 0 })
  }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  const assertSession = async () => {
    if (invalid) throw new Error('Database session was lost')
    const [row] = await client`SELECT pg_backend_pid() AS pid`
    if (invalid || row.pid !== pid) throw new Error('Database session changed')
  }
  let pid
  try {
    const [row] = await client`SELECT pg_backend_pid() AS pid`
    pid = row.pid
    if (locked) {
      const deadline = Date.now() + 10000
      while (!acquired) {
        const [lock] =
          await client`SELECT pg_try_advisory_lock(${advisoryLockKey}::bigint) AS acquired`
        acquired = lock.acquired
        if (!acquired) {
          if (Date.now() >= deadline)
            throw new Error('Database transition lock timed out')
          await delay(100)
        }
      }
    }
    await assertSession()
    const result = await operation(client, assertSession)
    await assertSession()
    return result
  } finally {
    process.removeListener('SIGINT', stop)
    process.removeListener('SIGTERM', stop)
    try {
      if (acquired && !invalid)
        await client`SELECT pg_advisory_unlock(${advisoryLockKey}::bigint)`
    } finally {
      closing = true
      await client.end({ timeout: 0 })
    }
  }
}

export async function captureCatalog(client) {
  await client.unsafe('SET search_path TO public, extensions')
  const catalog = {}
  for (const [key, query] of Object.entries(catalogQueries)) {
    const [row] = await client.unsafe(
      `SELECT coalesce(json_agg(t), '[]'::json) AS entries FROM (${query}) t`,
    )
    catalog[key] = row.entries
  }
  return catalog
}

export async function readTransitionLedger(client) {
  const [exists] =
    await client`SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS present`
  if (!exists.present) return []
  return client`SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at, id`
}

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalize(value[key])]),
    )
  return value
}
function equal(left, right) {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right))
}

/** Compare distinct projected memberships without depending on row order or grantor duplicates. */
export function equalRoleMemberships(left, right) {
  const entries = (rows) =>
    [...new Set(rows.map((row) => JSON.stringify(normalize(row))))].sort()
  return equal(entries(left), entries(right))
}

function expectedCatalog(manifest, phase) {
  const access = manifest.accessCatalogs[phase]
  if (!access) throw new Error('Missing expected phase access catalog')
  return {
    ...manifest.structure,
    tables: manifest.structure.tables.map((table) => {
      const flags = access.tableSecurity.find((entry) => entry.name === table.name)
      if (!flags) throw new Error('Missing table security flags')
      return { ...table, rls: flags.rls, force_rls: flags.force_rls }
    }),
    policies: access.policies,
    relationGrants: access.relationGrants,
    functionGrants: access.functionGrants,
    defaultPrivileges: access.defaultPrivileges,
  }
}

async function checkLegacyHistory(client) {
  const [exists] =
    await client`SELECT to_regclass('supabase_migrations.schema_migrations') IS NOT NULL AS present`
  if (!exists.present) return false
  const rows =
    await client`SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version`
  const expected = frozenSources.map((entry) => {
    const match = /^(\d+)_(.+)\.sql$/.exec(entry.name)
    if (!match) throw new Error('Invalid frozen legacy filename')
    return { version: match[1], name: match[2] }
  })
  return equal(
    rows.map((row) => ({ version: String(row.version), name: row.name })),
    expected,
  )
}

export async function auditExternalExposure(client) {
  const [row] = await client.unsafe(`SELECT
    EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
      WHERE n.nspname NOT IN ('public','pg_catalog','information_schema') AND n.nspname !~ '^pg_toast'
      AND NOT EXISTS(SELECT 1 FROM pg_depend e WHERE e.classid='pg_proc'::regclass AND e.objid=p.oid AND e.deptype='e')
      AND (p.prosrc ~* '(^|[^a-zA-Z0-9_])public[.]' OR EXISTS(SELECT 1 FROM pg_depend d
        JOIN pg_class c ON d.refclassid='pg_class'::regclass AND c.oid=d.refobjid
        JOIN pg_namespace cn ON cn.oid=c.relnamespace
        WHERE d.classid='pg_proc'::regclass AND d.objid=p.oid AND cn.nspname='public'))) AS function_exposure,
    EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      JOIN pg_rewrite r ON r.ev_class=c.oid JOIN pg_depend d ON d.classid='pg_rewrite'::regclass AND d.objid=r.oid
      JOIN pg_class target ON d.refclassid='pg_class'::regclass AND target.oid=d.refobjid
      JOIN pg_namespace tn ON tn.oid=target.relnamespace WHERE n.nspname NOT IN ('public','pg_catalog','information_schema')
      AND c.relkind IN ('v','m') AND tn.nspname='public') AS view_exposure,
    EXISTS(SELECT 1 FROM pg_auth_members WHERE member IN ('anon'::regrole,'authenticated'::regrole)) AS membership_exposure`)
  return row.function_exposure || row.view_exposure || row.membership_exposure
}

/**
 * Compare visible column order, preserving names and every structural field.
 * Dropped legacy columns leave physical attnum holes that a baseline cannot retain.
 * @param {Array<Record<string, unknown> & {table_name: string, position: number}>} columns
 */
function normalizeColumnOrdinals(columns) {
  const positions = new Map()
  return columns.map((column) => {
    const position = (positions.get(column.table_name) ?? 0) + 1
    positions.set(column.table_name, position)
    return { ...column, position }
  })
}

export async function inspectTransition(client, manifest, phase) {
  const migrations = transitionMigrations()
  const ledger = await readTransitionLedger(client)
  const expectedEntries = phase === 'legacy' ? 0 : phase === 'adopted' ? 2 : 3
  const differences = []
  if (
    ledger.length !== expectedEntries ||
    ledger.some(
      (row, index) =>
        row.hash !== migrations[index]?.hash ||
        Number(row.created_at) !== migrations[index]?.folderMillis,
    )
  )
    differences.push('Migration ledger differs from the requested phase')
  const catalog = await captureCatalog(client)
  const expected = expectedCatalog(manifest, phase)
  for (const key of Object.keys(expected)) {
    const actualRows =
      key === 'columns' ? normalizeColumnOrdinals(catalog[key]) : catalog[key]
    const expectedRows =
      key === 'columns' ? normalizeColumnOrdinals(expected[key]) : expected[key]
    if (!equal(actualRows, expectedRows)) differences.push(`Catalog differs: ${key}`)
  }
  if (phase === 'legacy' && !(await checkLegacyHistory(client)))
    differences.push('Legacy migration history differs')
  if (await auditExternalExposure(client))
    differences.push('Unrepresented external access path requires an amendment')
  return { compatible: differences.length === 0, differences }
}

export async function isEmptyApplication(client, manifest) {
  const catalog = await captureCatalog(client)
  const emptyKeys = [
    'tables',
    'columns',
    'constraints',
    'indexes',
    'enums',
    'sequences',
    'views',
    'functions',
    'triggers',
  ]
  if (
    emptyKeys.some((key) => catalog[key].length !== 0) ||
    catalog.policies.length !== 0 ||
    !equal(catalog.defaultPrivileges, manifest.catalog.defaultPrivileges) ||
    !equalRoleMemberships(catalog.roleMemberships, manifest.structure.roleMemberships) ||
    !equal(catalog.extensions, manifest.structure.extensions)
  )
    return false
  const storageGrants = manifest.catalog.relationGrants.filter(
    (grant) => grant.schema === 'storage',
  )
  return (
    equal(catalog.relationGrants, storageGrants) && !(await auditExternalExposure(client))
  )
}

/** @param {TransitionOptions} options */
export async function checkTransition(options) {
  const manifest = loadTransitionManifest(options.manifestPath)
  return withTransitionSession(
    options,
    (client) => inspectTransition(client, manifest, options.phase),
    false,
  )
}

/**
 * @param {string[]} args
 * @param {{allowRollback?: boolean}} capability
 * @returns {{options: TransitionOptions, help: boolean, rollback: boolean}}
 */
export function parseTransitionCli(args = process.argv.slice(2), capability = {}) {
  /** @type {TransitionOptions} */
  const options = {
    environment: 'local',
    manifestPath: defaultManifestPath,
    phase: 'legacy',
  }
  const seen = new Set()
  let help = false,
    rollback = false
  for (let index = 0; index < args.length; index++) {
    const flag = args[index]
    if (seen.has(flag)) throw new Error('Invalid command arguments')
    seen.add(flag)
    if (flag === '--help') {
      help = true
      continue
    }
    if (flag === '--rollback' && capability.allowRollback) {
      rollback = true
      continue
    }
    if (!['--environment', '--manifest', '--phase'].includes(flag))
      throw new Error('Invalid command arguments')
    const value = args[++index]
    if (!value || value.startsWith('--')) throw new Error('Invalid command arguments')
    if (flag === '--environment') {
      if (value !== 'local' && value !== 'dev' && value !== 'prod')
        throw new Error('Invalid command arguments')
      options.environment = value
    } else if (flag === '--phase') {
      if (value !== 'legacy' && value !== 'adopted' && value !== 'server-owned')
        throw new Error('Invalid command arguments')
      options.phase = value
    } else options.manifestPath = value
  }
  return { options, help, rollback }
}

/** @returns {TransitionOptions} */
export function cliOptions(args = process.argv.slice(2)) {
  return parseTransitionCli(args).options
}

export function transitionUsage(allowRollback = false) {
  return (
    'Usage: --environment local|dev|prod --manifest <path> --phase legacy|adopted|server-owned --help' +
    (allowRollback ? ' --rollback' : '')
  )
}

/** @param {() => Promise<void>} operation */
export function runTransitionCli(operation) {
  void operation().catch((error) => {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    const errorCode =
      error && typeof error === 'object' && 'code' in error ? error.code : undefined
    const rawMessage = error instanceof Error ? error.message : String(error)
    const message = rawMessage
      .replace(/(?:postgres(?:ql)?:\/\/)[^\s]+/gi, 'postgres://[redacted]')
      .replace(/(password\s*[=:]\s*)\S+/gi, '$1[redacted]')

    console.error('Database command failed:', { errorName, errorCode, message })
    process.exitCode = 1
  })
}
export function isMain(url) {
  return !!process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === url
}
if (isMain(import.meta.url)) {
  runTransitionCli(async () => {
    const parsed = parseTransitionCli()
    if (parsed.help) {
      console.log(transitionUsage())
      return
    }
    const result = await checkTransition(parsed.options)
    console.log(JSON.stringify(result))
    if (!result.compatible) process.exitCode = 1
  })
}
