'use server'

import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
  cookies().set({
    name,
    value,
    httpOnly: true,
    path: '/',
  })
}
