import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    cookieName: string
  }
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const cookieValue = cookies().get(params.cookieName)?.value

  return NextResponse.json(cookieValue ?? null)
}
