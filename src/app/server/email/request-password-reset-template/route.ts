import { NextResponse } from 'next/server'

import { renderTemplate } from '@/services/email/templates/components/renderTemplate'
import { RequestPasswordResetTemplate } from '@/services/email/templates/RequestPasswordResetTemplate'

export async function GET() {
  // eslint-disable-next-line
  const html = renderTemplate(RequestPasswordResetTemplate())

  return NextResponse.json(html)
}
