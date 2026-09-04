export const isSafeNextRoute = (nextRoute: string | undefined): nextRoute is string => {
  if (!nextRoute?.startsWith('/') || nextRoute.startsWith('//')) return false
  if (nextRoute.includes('\\')) return false
  if (nextRoute.startsWith('/auth/') && nextRoute !== '/auth/reset-password') return false
  if (nextRoute === '/auth') return false

  try {
    return new URL(nextRoute, 'http://stardust.local').origin === 'http://stardust.local'
  } catch {
    return false
  }
}
