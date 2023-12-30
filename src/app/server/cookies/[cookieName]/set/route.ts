import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { cookie } = await request.json()

  cookies().set({
    name: cookie.name,
    value: cookie.value,
    httpOnly: true,
    path: '/',
  })
}
