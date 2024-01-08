import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const passwordTokenSecret = process.env.PASSWORD_TOKEN_SECRET

  console.log(resend)

  if (!passwordTokenSecret)
    throw new Error('PASSWORD_TOKEN_SECRET must be provided')

  const passwordToken = jwt.sign({}, passwordTokenSecret)

  return NextResponse.json({ passwordToken })
}
