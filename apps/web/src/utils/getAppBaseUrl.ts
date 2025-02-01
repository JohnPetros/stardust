import { ENV } from '@/constants'

export function getAppBaseUrl() {
  const host = ENV.appHost
  const url = host.includes('http') ? host : `https://${host}`
  return url
}
