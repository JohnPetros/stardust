import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    cookieName: string
  }
}

export async function DELETE(
  _: NextRequest,
  { params: { cookieName } }: RouteParams
) {
  const hasCookie = cookies().has(cookieName)

  if (hasCookie) cookies().delete(cookieName)
  else NextResponse.json({ status: 'cookie does not exit' }, { status: 400 })

  return NextResponse.json({ status: 'deleted' })
}
