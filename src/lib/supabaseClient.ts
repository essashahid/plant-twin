import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * True when both Supabase env vars are present. When false the app falls back
 * to a localStorage-backed store so the demo still works without a backend.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export const PHOTO_BUCKET = "plant-photos";

/**
 * Stable demo user id. Real auth is out of scope for this step — every plant
 * is scoped to this anonymous id so the data model is ready for auth later.
 */
const DEMO_USER_KEY = "planttwin_demo_user_id";

export function getDemoUserId(): string {
  if (typeof window === "undefined") return "demo-user";
  let id = window.localStorage.getItem(DEMO_USER_KEY);
  if (!id) {
    id = `demo-${crypto.randomUUID()}`;
    window.localStorage.setItem(DEMO_USER_KEY, id);
  }
  return id;
}
