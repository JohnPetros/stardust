import { NextResponse } from 'next/server'

import { ConfirmSignUpTemplate } from '@/infra/email/resend/react-email/templates/ConfirmSignUpTemplate'
import { renderTemplate } from '@/infra/email/resend/react-email/utils/renderTemplate'

export async function GET() {
  // eslint-disable-next-line
  const html = renderTemplate(ConfirmSignUpTemplate())

  return NextResponse.json(html)
}
