import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function GET() {
  const passwordTokenSecret = process.env.PASSWORD_TOKEN_SECRET

  if (!passwordTokenSecret)
    throw new Error('PASSWORD_TOKEN_SECRET must be provided')

  const passwordToken = jwt.sign({}, passwordTokenSecret)

  return NextResponse.json({ passwordToken })
}
