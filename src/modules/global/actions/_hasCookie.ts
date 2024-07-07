'use server'

import { cookies } from 'next/headers'

export async function _hasCookie(name: string) {
  const cookie = cookies().get(name)

  return !!cookie
}
