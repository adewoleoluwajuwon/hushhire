// src/lib/AuthProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../api/supabase";

type Role = "seeker" | "employer" | "admin";
type Profile = { id: string; role: Role } | null;

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile;
  loading: boolean; // true until session + (if logged in) profile resolve
  refreshProfile: () => Promise<void>; // manual refetch (e.g., after profile update)
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

// ---- Helpers ----
function metaProfileFallback(user: User): Profile {
  const metaRole =
    (user.user_metadata?.role as Role | undefined) ??
    (user.app_metadata?.role as Role | undefined) ??
    null;
  return metaRole ? { id: user.id, role: metaRole } : null;
}

/**
 * Ensure a profile row exists and return it.
 * Works for schemas that use either:
 *   - profiles.id = auth.uid()        (Supabase default)
 *   - profiles.user_id = auth.uid()   (custom)
 */
async function ensureProfile(user: User): Promise<Profile> {
  const uid = user.id;
  const cols = "id, user_id, role";

  async function fetchExisting() {
    const byId = await supabase
      .from("profiles")
      .select(cols)
      .eq("id", uid)
      .maybeSingle();

    if (byId.data) return byId.data;

    const byUserId = await supabase
      .from("profiles")
      .select(cols)
      .eq("user_id", uid)
      .maybeSingle();

    if (byUserId.data) return byUserId.data;

    return null;
  }

  // 1) Try to find an existing row
  const existing = await fetchExisting();
  if (existing) {
    return {
      id: (existing.id ?? existing.user_id) as string,
      role: existing.role as Role,
    };
  }

  // 2) Not found → create default seeker profile.
  // Try { id: uid } first (Supabase default), then fallback to { user_id: uid }.
  let ins = await supabase
    .from("profiles")
    .insert([{ id: uid, role: "seeker" }])
    .select(cols)
    .maybeSingle();

  if (ins.error) {
    // If another client created it concurrently, fetch and return.
    if ((ins.error as any).code === "23505") {
      const afterConflict = await fetchExisting();
      if (afterConflict) {
        return {
          id: (afterConflict.id ?? afterConflict.user_id) as string,
          role: afterConflict.role as Role,
        };
      }
    }

    // Try alternative schema with user_id
    let ins2 = await supabase
      .from("profiles")
      .insert([{ user_id: uid, role: "seeker" }])
      .select(cols)
      .maybeSingle();

    if (ins2.error) {
      // If that also races, refetch; otherwise throw.
      if ((ins2.error as any).code === "23505") {
        const afterConflict2 = await fetchExisting();
        if (afterConflict2) {
          return {
            id: (afterConflict2.id ?? afterConflict2.user_id) as string,
            role: afterConflict2.role as Role,
          };
        }
      }
      throw ins2.error;
    }

    if (ins2.data) {
      return {
        id: (ins2.data.id ?? ins2.data.user_id) as string,
        role: ins2.data.role as Role,
      };
    }
  }

  if (ins.data) {
    return {
      id: (ins.data.id ?? ins.data.user_id) as string,
      role: ins.data.role as Role,
    };
  }

  // As a last resort, return metadata fallback (or null)
  return metaProfileFallback(user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (user: User) => {
    try {
      const p = await ensureProfile(user);
      setProfile(p);
    } catch {
      // If RLS or schema issues block reads/inserts, fall back to auth metadata (if present)
      setProfile(metaProfileFallback(user));
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const sess = data.session ?? null;
    if (!sess?.user) {
      setProfile(null);
      return;
    }
    await loadProfile(sess.user);
  }, [loadProfile]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const sess = data.session ?? null;
      setSession(sess);

      if (sess?.user) {
        await loadProfile(sess.user);
        if (!mounted) return;
      } else {
        setProfile(null);
      }

      if (mounted) setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      if (!mounted) return;

      setSession(sess ?? null);
      setLoading(true);

      if (sess?.user) {
        await loadProfile(sess.user);
        if (!mounted) return;
      } else {
        setProfile(null);
      }

      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      refreshProfile,
    }),
    [session, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Canonical hook
export function useAuth() {
  return useContext(AuthContext);
}

// Back-compat alias if some code still imports useSession()
export function useSession() {
  return useContext(AuthContext);
}
