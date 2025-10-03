// src/lib/hooks.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { useEffect, useState } from "react";

// ✅ Helper: get current user or throw
export async function getUserOrThrow() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Not authenticated");
  return user;
}

// ✅ Ensure profile exists (moved from AuthCard)
export async function ensureProfile(role, fullName) {
  const user = await getUserOrThrow();

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name: fullName,
      role,
    },
    { onConflict: "user_id" },
  );

  if (upsertError) throw upsertError;
}

// ---- LIST JOBS ----
export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, companies(name,logo_url)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// ---- SINGLE JOB ----
export function useJob(jobId) {
  return useQuery({
    queryKey: ["job", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, companies(name,logo_url)")
        .eq("id", jobId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

// ---- CREATE / UPDATE JOB ----
export function useUpsertJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const user = await getUserOrThrow();

      const toInsert = { ...payload, created_by: user.id };
      const { data, error } = await supabase
        .from("jobs")
        .upsert(toInsert, { onConflict: "id" })
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

// ---- APPLY TO JOB ----
export function useApply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const user = await getUserOrThrow();

      const { data, error } = await supabase
        .from("applications")
        .insert({
          job_id: payload.job_id,
          seeker_id: user.id,
          cover_letter: payload.cover_letter,
          resume_url: payload.resume_url,
        })
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

// ---- SESSION HOOK ----
export function useSession() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch current user
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    // listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user };
}
