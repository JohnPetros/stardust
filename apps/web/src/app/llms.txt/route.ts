import { NextResponse } from 'next/server'
import { CLIENT_ENV } from '@/constants'

export async function GET() {
  const content = `
# LLMs access policy for ${CLIENT_ENV.stardustWebUrl}
# This file defines which AI crawlers are allowed to read or train on this content.

User-Agent: GPTBot
Allow: /
Disallow: /auth/
Disallow: /api/
Disallow: /admin/
Disallow: /space/
Disallow: /shop/
Disallow: /ranking/
Disallow: /challenging/
Disallow: /lesson/
Disallow: /rewarding/
Disallow: /playground/
Purpose: browsing

User-Agent: ChatGPT-User
Allow: /
Disallow: /auth/
Disallow: /api/
Disallow: /admin/
Disallow: /space/
Disallow: /shop/
Disallow: /ranking/
Disallow: /challenging/
Disallow: /lesson/
Disallow: /rewarding/
Disallow: /playground/
Purpose: browsing

User-Agent: ClaudeBot
Disallow: /

User-Agent: PerplexityBot
Disallow: /

User-Agent: Google-Extended
Disallow: /

User-Agent: *
Disallow: /
  `.trim()

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
