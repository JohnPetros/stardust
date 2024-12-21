import { NextResponse } from 'next/server'
import { RequestPasswordResetTemplate } from '@/infra/email/resend/react-email/templates/RequestPasswordResetTemplate'
import { renderTemplate } from '@/infra/email/resend/react-email/utils/renderTemplate'

export async function GET() {
  // eslint-disable-next-line
  const html = renderTemplate(RequestPasswordResetTemplate())

  return NextResponse.json(html)
}
