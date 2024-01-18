'use server'

import { cookies } from 'next/headers'

export async function hasCookie(name: string) {
  const cookie = cookies().get(name)

  return !!cookie
}
