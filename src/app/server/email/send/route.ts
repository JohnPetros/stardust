import { NextRequest, NextResponse } from 'next/server'

import { getEmailProvider } from '@/providers/emailProvider'

const emailProvider = getEmailProvider()

export async function POST(request: NextRequest) {
  const email = await request.json()

  try {
    await emailProvider.send({
      sender: email.sender,
      recipient: email.recipient,
      template: email.template,
      subject: email.subject,
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
