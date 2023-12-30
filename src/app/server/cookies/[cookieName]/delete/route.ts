import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function DELETE(request: NextRequest) {
  const { cookieName } = await request.json()

  cookies().delete(cookieName)
}
