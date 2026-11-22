import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { buildStagingUploadPlan } from '../seed-staging-assets.mjs'

const script = fileURLToPath(new URL('../seed-staging-assets.mjs', import.meta.url))
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.from([4, 0, 0, 0]), Buffer.from('WEBPVP8 ')])
const stagingEnv = {
  S3_ACCOUNT_ID: 'abc123',
  S3_BUCKET_NAME: 'stardust-staging',
  S3_ACCESS_KEY_ID: 'fixture-key-id',
  S3_SECRET_ACCESS_KEY: 'fixture-secret',
  STAGING_ASSETS_BUCKET: 'stardust-staging',
  PRODUCTION_ASSETS_BUCKET: 'stardust-production',
  STAGING_CDN_URL: 'https://cdn-staging.example.test',
}

let directory
let sources
const fileNames = Array.from({ length: 10 }, (_, index) => `planet-fixture-${index}-image.webp`)

before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'seed-staging-assets-'))
  const images = join(directory, 'images')
  await mkdir(images)
  for (const name of fileNames) await writeFile(join(images, name), webp)
  await writeFile(join(images, 'planet-test.image.svg'), '<svg></svg>')
  await writeFile(
    join(directory, 'catalog.json'),
    JSON.stringify({ tables: { planets: [...fileNames.map((image) => ({ image })), { image: 'planet-test.image.svg' }] } }),
  )
  sources = {
    catalogUrl: pathToFileURL(join(directory, 'catalog.json')),
    imagesDirectory: pathToFileURL(`${images}/`),
  }
})

after(() => rm(directory, { recursive: true, force: true }))

test('the upload plan has exactly the ten planet WebP keys and ignores other assets', async () => {
  const plan = await buildStagingUploadPlan(stagingEnv, sources)
  assert.deepEqual(plan.items.map((item) => item.key), fileNames.map((name) => `images/planets/${name}`))
  assert.ok(plan.items.every((item) => item.contentType === 'image/webp' && item.body.equals(webp)))
  assert.equal(plan.endpoint, 'https://abc123.r2.cloudflarestorage.com')
  assert.equal(plan.cdnBase, 'https://cdn-staging.example.test')
})

test('every guard refuses before a plan, and so before any R2 call, exists', async () => {
  const cases = {
    'missing credentials': { S3_ACCESS_KEY_ID: undefined },
    'missing secret': { S3_SECRET_ACCESS_KEY: '' },
    'bucket differs from the staging bucket': { S3_BUCKET_NAME: 'another-bucket' },
    'bucket is the production bucket': { S3_BUCKET_NAME: 'stardust-production', STAGING_ASSETS_BUCKET: 'stardust-production' },
    'production mode': { MODE: 'production' },
    'missing production bucket variable': { PRODUCTION_ASSETS_BUCKET: undefined },
    'insecure CDN URL': { STAGING_CDN_URL: 'http://cdn-staging.example.test' },
  }
  for (const [name, override] of Object.entries(cases)) {
    await assert.rejects(buildStagingUploadPlan({ ...stagingEnv, ...override }, sources), Error, name)
  }
  await assert.rejects(
    buildStagingUploadPlan(stagingEnv, { ...sources, catalogUrl: pathToFileURL(join(directory, 'missing.json')) }),
    /Asset catalog required/,
  )
  await assert.rejects(
    buildStagingUploadPlan(stagingEnv, { ...sources, imagesDirectory: pathToFileURL(join(directory, 'empty/')) }),
    /Missing catalog image/,
  )
})

test('the script exits non-zero without printing credentials when a guard refuses', () => {
  const result = spawnSync(process.execPath, [script], {
    encoding: 'utf8',
    timeout: 15000,
    env: { PATH: process.env.PATH, ...stagingEnv, S3_BUCKET_NAME: 'stardust-production' },
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Staging asset seed failed/)
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /fixture-secret|fixture-key-id/)
})

test('the script never lists, deletes or changes policies', async () => {
  const source = await readFile(script, 'utf8')
  assert.doesNotMatch(source, /DeleteObject|ListObjects|PutBucketPolicy|DeleteBucket|GetBucketPolicy/)
  assert.match(source, /PutObjectCommand/)
})
