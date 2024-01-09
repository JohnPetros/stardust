import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { EmailProvider } from '@/providers/emailProvider'
import { META_DATA } from '@/services/email/config/metaData'
import { renderTemplate } from '@/services/email/templates/components/renderTemplate'
import { RequestPasswordResetTemplate } from '@/services/email/templates/RequestPasswordResetTemplate'

const emailProvider = EmailProvider()

export async function POST(request: NextRequest) {
  const { recipient } = await request.json()

  if (!recipient)
    return NextResponse.json(
      { message: 'Recipient email must be provided' },
      { status: 500 }
    )

  const passwordTokenSecret = process.env.PASSWORD_TOKEN_SECRET

  if (!passwordTokenSecret)
    return NextResponse.json(
      { message: 'PASSWORD_TOKEN_SECRET must be provided' },
      { status: 500 }
    )

  const passwordToken = jwt.sign({}, passwordTokenSecret)

  try {
    await emailProvider.send({
      sender: META_DATA.sender,
      recipient: recipient,
      subject: 'Redefinção de senha',
      template: renderTemplate(
        RequestPasswordResetTemplate({
          passwordToken,
          userEmail: recipient,
        })
      ),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'ok' })
}
