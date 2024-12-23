import { ENV } from '@/constants'

export function getAppBaseUrl() {
  let url = ENV.url
  url = url.includes('http') ? url : `https://${url}`
  return url
}
