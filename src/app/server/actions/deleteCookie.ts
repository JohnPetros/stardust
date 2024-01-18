'use server'

import { cookies } from 'next/headers'

export async function deleteCookie(name: string) {
  return cookies().delete(name)
}
