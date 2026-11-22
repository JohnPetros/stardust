import { readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(new URL('../apps/server/package.json', import.meta.url))
const { S3Client, PutObjectCommand, GetBucketPolicyCommand, PutBucketPolicyCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3')

async function seedAssets() {
  const endpoint = new URL(process.env.S3_ENDPOINT)
  if (process.env.NODE_ENV === 'production' || endpoint.protocol !== 'http:' || endpoint.hostname !== '127.0.0.1' || endpoint.pathname !== '/' || endpoint.search || endpoint.username || endpoint.password) {
    throw new Error('Local MinIO endpoint required')
  }
  const bucket = process.env.MINIO_BUCKET || 'stardust-bucket-local'
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)) throw new Error('Invalid bucket')
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  if (!accessKeyId || !secretAccessKey) throw new Error('MinIO credentials required')

  const catalog = JSON.parse(await readFile(new URL('../apps/server/src/database/seeders/data/seed-catalog.json', import.meta.url), 'utf8'))
  const assets = []
  const references = new Set()
  const folders = ['planets', 'achievements', 'avatars', 'rankings', 'rockets']
  for (const folder of folders) {
    const directory = new URL(`../apps/server/src/database/seeders/assets/images/${folder}/`, import.meta.url)
    const files = (await readdir(directory)).filter((file) => /\.(svg|jpg|webp)$/.test(file))
    const records = catalog.tables[folder === 'rankings' ? 'tiers' : folder]
    if (!Array.isArray(records)) throw new Error('Asset catalog required')
    for (const record of records) {
      for (const file of [record.image, record.icon].filter(Boolean)) {
        if (!files.includes(file)) throw new Error('Missing catalog image')
        references.add(`images/${folder}/${file}`)
      }
    }
    for (const file of files) {
      const body = await readFile(new URL(file, directory))
      const isSvg = file.endsWith('.svg')
      let contentType
      if (isSvg && body.toString().includes('<svg')) contentType = 'image/svg+xml'
      else if (!isSvg && body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff) contentType = 'image/jpeg'
      else if (!isSvg && body.toString('ascii', 0, 4) === 'RIFF' && body.toString('ascii', 8, 12) === 'WEBP') contentType = 'image/webp'
      else if (!isSvg && body.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(body.toString('ascii', 8, 32))) contentType = 'image/avif'
      else throw new Error('Invalid image')
      assets.push({ key: `images/${folder}/${file}`, body, contentType })
    }
  }

  const galaxies = catalog.tables.galaxies
  if (!Array.isArray(galaxies)) throw new Error('Galaxy catalog required')
  const galaxyAnimations = new Set()
  for (const galaxy of galaxies) {
    const animationMatch = /^([a-z0-9-]+)\.json$/.exec(galaxy.animation)
    if (!/^[a-z0-9-]+$/.test(galaxy.slug) || !animationMatch) throw new Error('Invalid galaxy animation')
    if (galaxyAnimations.has(galaxy.animation)) continue
    galaxyAnimations.add(galaxy.animation)
    const body = await readFile(new URL(`../packages/studio/public/projects/galaxies/${animationMatch[1]}/lottie.json`, import.meta.url))
    if (!Array.isArray(JSON.parse(body.toString()).layers)) throw new Error('Invalid galaxy Lottie')
    assets.push({ key: `lotties/galaxies/${galaxy.animation}`, body, contentType: 'application/json' })
    references.add(`lotties/galaxies/${galaxy.animation}`)
  }

  const client = new S3Client({ endpoint: endpoint.origin, region: 'us-east-1', forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } })
  try {
    let policy = { Version: '2012-10-17', Statement: [] }
    try {
      const response = await client.send(new GetBucketPolicyCommand({ Bucket: bucket }))
      policy = JSON.parse(response.Policy)
    } catch (error) {
      if (error.name !== 'NoSuchBucketPolicy') throw error
    }
    for (const { key, body, contentType } of assets) {
      await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType, CacheControl: 'no-cache' }))
    }
    const seededKeys = new Set(assets.map((asset) => asset.key))
    const staleKeys = []
    for (const prefix of [...folders.map((folder) => `images/${folder}/`), 'lotties/galaxies/']) {
      let ContinuationToken
      do {
        const page = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken }))
        for (const { Key } of page.Contents ?? []) if (!seededKeys.has(Key)) staleKeys.push(Key)
        ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined
      } while (ContinuationToken)
    }
    for (let index = 0; index < staleKeys.length; index += 1000) {
      const Objects = staleKeys.slice(index, index + 1000).map((Key) => ({ Key }))
      const response = await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects, Quiet: true } }))
      if (response.Errors?.length) throw new Error('Stale asset removal failed')
    }
    const sid = 'StardustLocalSeedPlanetsRead'
    policy.Statement = policy.Statement.filter((statement) => statement.Sid !== sid)
    policy.Statement.push({ Sid: sid, Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [...folders.map((folder) => `arn:aws:s3:::${bucket}/images/${folder}/*`), `arn:aws:s3:::${bucket}/lotties/galaxies/*`] })
    await client.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: JSON.stringify(policy) }))
    for (const file of references) {
      const response = await fetch(`${endpoint.origin}/${bucket}/${file}`)
      const asset = assets.find((item) => item.key === file)
      const body = Buffer.from(await response.arrayBuffer())
      if (!response.ok || !response.headers.get('content-type')?.includes(asset.contentType) || !body.equals(asset.body)) throw new Error('Public asset verification failed')
    }
    console.log(`Removed ${staleKeys.length} stale catalog assets.`)
    console.log(`Uploaded ${assets.length} catalog assets; verified ${references.size} catalog references with anonymous HTTP access.`)
    console.log(`Local CDN URL: ${endpoint.origin}/${bucket}`)
  } finally {
    client.destroy()
  }
}

seedAssets().catch(() => {
  console.error('Local asset seed failed. Check MinIO, root .env.local and catalog assets.')
  process.exitCode = 1
})
