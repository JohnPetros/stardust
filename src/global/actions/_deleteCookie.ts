'use server'

import { cookies } from 'next/headers'

export async function _deleteCookie(name: string) {
  return cookies().delete(name)
}
