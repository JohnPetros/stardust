import { buildRedisOptions } from '../buildRedisOptions'

describe('buildRedisOptions', () => {
  it('should build TLS options for rediss hosts', () => {
    const options = buildRedisOptions('rediss://user:pass@cache.example.com:6380/2')

    expect(options).toMatchObject({
      host: 'cache.example.com',
      port: 6380,
      username: 'user',
      password: 'pass',
      db: 2,
      lazyConnect: true,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 15_000,
      family: 4,
    })
    expect(options.tls).toMatchObject({
      rejectUnauthorized: true,
      servername: 'cache.example.com',
    })
  })

  it('should omit servername for IP-based TLS hosts', () => {
    const options = buildRedisOptions('rediss://127.0.0.1:6380/0')

    expect(options.tls).toMatchObject({
      rejectUnauthorized: true,
    })
    expect(options.tls).not.toHaveProperty('servername')
  })
})
