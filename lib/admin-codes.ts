// Copyright 2026 Caleb Maina
'use server'

/**
 * validates the admin code against the one in .env
 * the code is never exposed to the client 
 */
export async function validateAdminCode(
  code: string
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.ADMIN_SECRET_CODE

  if (!secret) {
    console.error('ADMIN_SECRET_CODE is not set in environment variables.')
    return { ok: false, error: 'Admin access is not configured. Contact support.' }
  }

  if (code.trim().toUpperCase() !== secret.trim().toUpperCase()) {
    return { ok: false, error: 'Incorrect admin code. Please check and try again.' }
  }

  return { ok: true }
}