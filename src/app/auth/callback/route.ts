import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')

  // Handle explicit errors from Supabase (e.g. expired link, access denied)
  if (error || errorCode) {
    let message = errorDescription || error || 'Authentication failed'
    if (errorCode === 'otp_expired' || message.includes('expired')) {
      message = 'This confirmation link has expired or was already used.'
    }
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(message)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // Handle exchange errors
    const msg = exchangeError.message || 'Verification failed'
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`)
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Invalid authentication request`)
}
