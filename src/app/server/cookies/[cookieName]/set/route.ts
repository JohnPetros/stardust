import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    cookieName: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const cookie = await request.json()

    console.log({ cookie })
    console.log({ params })

    const response = new NextResponse()

    response.cookies.set(params.cookieName, cookie.value, {
      secure: true,
      httpOnly: true,
      maxAge: cookie.expiresIn,
    })

    return response
  } catch (error) {
    console.log({ error })
  }
}
