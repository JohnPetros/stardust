'use server'

import { cookies } from 'next/headers'

export async function _getCookie(name: string) {
  return cookies().get(name)?.value ?? null
}
