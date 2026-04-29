import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for Client Components.
 * Uses @supabase/ssr for browser-side authentication.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}

// Singleton instance for client-side use
export const supabase = createClient()