import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const PLANET_IMAGE_COUNT = 10
const PLANET_IMAGE_PATTERN = /^planet-[a-z0-9-]+-image\.webp$/
const defaultCatalogUrl = new URL('../apps/server/src/database/seeders/data/seed-catalog.json', import.meta.url)
const defaultImagesDirectory = new URL('../apps/server/src/database/seeders/assets/images/planets/', import.meta.url)

class GuardError extends Error {}

function refuse(message) {
  throw new GuardError(message)
}

function isWebp(body) {
  return body.toString('ascii', 0, 4) === 'RIFF' && body.toString('ascii', 8, 12) === 'WEBP'
}

/**
 * Validates every guard before any call to R2 and builds the upload plan.
 * Never reads or prints credential values.
 * @param {Record<string, string | undefined>} environment
 * @param {{ catalogUrl?: URL, imagesDirectory?: URL }} [sources]
 */
export async function buildStagingUploadPlan(
  environment,
  { catalogUrl = defaultCatalogUrl, imagesDirectory = defaultImagesDirectory } = {},
) {
  if (environment.MODE === 'production' || environment.NODE_ENV === 'production') {
    refuse('Staging asset upload cannot run in production mode')
  }
  const {
    S3_ACCOUNT_ID: accountId,
    S3_BUCKET_NAME: bucket,
    S3_ACCESS_KEY_ID: accessKeyId,
    S3_SECRET_ACCESS_KEY: secretAccessKey,
    STAGING_ASSETS_BUCKET: stagingBucket,
    PRODUCTION_ASSETS_BUCKET: productionBucket,
    STAGING_CDN_URL: cdnUrl,
  } = environment
  if (!accountId || !bucket || !accessKeyId || !secretAccessKey) refuse('R2 staging credentials required')
  if (!stagingBucket || !productionBucket) refuse('Staging and production bucket names required')
  if (!/^[A-Za-z0-9]+$/.test(accountId)) refuse('Invalid R2 account')
  if (bucket !== stagingBucket) refuse('Bucket is not the staging assets bucket')
  if (bucket === productionBucket || stagingBucket === productionBucket) {
    refuse('Bucket is the production assets bucket')
  }
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)) refuse('Invalid bucket')
  let cdn
  try {
    cdn = new URL(cdnUrl ?? '')
  } catch {
    refuse('Staging CDN URL required')
  }
  if (cdn.protocol !== 'https:' || cdn.username || cdn.password || cdn.search || cdn.hash) {
    refuse('Invalid staging CDN URL')
  }

  let catalog
  try {
    catalog = JSON.parse(await readFile(catalogUrl, 'utf8'))
  } catch {
    refuse('Asset catalog required')
  }
  const planets = catalog?.tables?.planets
  if (!Array.isArray(planets)) refuse('Asset catalog required')
  const files = [...new Set(planets.map((planet) => planet.image).filter((image) => typeof image === 'string' && image.endsWith('.webp')))].sort()
  if (files.length !== PLANET_IMAGE_COUNT || !files.every((file) => PLANET_IMAGE_PATTERN.test(file))) {
    refuse(`Catalog must reference exactly ${PLANET_IMAGE_COUNT} WebP planet images`)
  }
  const items = []
  for (const file of files) {
    let body
    try {
      body = await readFile(new URL(file, imagesDirectory))
    } catch {
      refuse('Missing catalog image')
    }
    if (!isWebp(body)) refuse('Invalid WebP image')
    items.push({ key: `images/planets/${file}`, body, contentType: 'image/webp' })
  }

  const base = cdn.origin + cdn.pathname.replace(/\/+$/, '')
  return {
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    bucket,
    accessKeyId,
    secretAccessKey,
    cdnBase: base,
    items,
  }
}

/** Uploads the planet images with idempotent PutObject calls only: no list, delete or policy calls. */
async function uploadAssets(plan) {
  const require = createRequire(new URL('../apps/server/package.json', import.meta.url))
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
  const client = new S3Client({
    endpoint: plan.endpoint,
    region: 'auto',
    credentials: { accessKeyId: plan.accessKeyId, secretAccessKey: plan.secretAccessKey },
  })
  try {
    for (const { key, body, contentType } of plan.items) {
      await client.send(new PutObjectCommand({ Bucket: plan.bucket, Key: key, Body: body, ContentType: contentType, CacheControl: 'no-cache' }))
    }
  } finally {
    client.destroy()
  }
  for (const { key, body } of plan.items) {
    const response = await fetch(`${plan.cdnBase}/${key}`)
    const received = Buffer.from(await response.arrayBuffer())
    if (!response.ok || !received.equals(body)) throw new GuardError('Public asset verification failed')
  }
}

async function seedStagingAssets() {
  const plan = await buildStagingUploadPlan(process.env)
  await uploadAssets(plan)
  console.log(`Uploaded ${plan.items.length} planet images to the staging bucket; verified each one through the staging CDN.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedStagingAssets().catch((error) => {
    console.error(`Staging asset seed failed: ${error instanceof GuardError ? error.message : 'R2 upload failed'}`)
    process.exitCode = 1
  })
}
