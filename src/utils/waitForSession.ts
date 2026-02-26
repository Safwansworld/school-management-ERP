// utils/waitForSession.ts
import { supabase } from '../lib/supabase'

export const waitForSession = async (timeout = 4000): Promise<boolean> => {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const { data } = await supabase.auth.getSession()
    if (data.session) return true
    await new Promise(res => setTimeout(res, 200)) // wait 200ms and try again
  }
  console.warn('[WAIT] Session not ready after timeout')
  return false
}
