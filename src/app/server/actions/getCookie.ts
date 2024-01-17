import { cookies } from 'next/headers'

export async function getCookie(name: string) {
  return cookies().get(name)?.value ?? null
}
