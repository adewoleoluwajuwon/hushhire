// src/components/JobCard.tsx
import { Card, Badge, Button } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useAuth } from "../lib/AuthProvider";
import type { Job } from "../lib/types";

export default function JobCard({ job }: { job: Job }) {
  const { session } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load saved-state
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.user) {
        if (!cancelled) setSaved(false);
        return;
      }
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("user_id", session.user.id)
        .eq("job_id", job.id)
        .maybeSingle();
      if (!cancelled) setSaved(!!data && !error);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, job.id]);

  async function toggleSave() {
    if (!session) {
      nav(`/auth?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("user_id", session.user.id)
          .eq("job_id", job.id);
        if (error) throw error;
        setSaved(false);
      } else {
        const { error } = await supabase
          .from("saved_jobs")
          .insert([{ user_id: session.user.id, job_id: job.id }]);
        // tolerate duplicate
        if (error && (error as any).code !== "23505") throw error;
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded bg-gray-200" />
        <div className="flex-1">
          <div className="flex justify-between gap-2">
            <h3 className="text-lg font-semibold dark:text-white">
              {job.title}
            </h3>
            <Badge color="info">{job.employment_type}</Badge>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            {job.companies?.name ?? "Company"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge color="gray">{job.location_type}</Badge>
            {job.tags?.slice(0, 3).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button color="light" onClick={toggleSave} disabled={saving}>
              {saving ? "…" : saved ? "Unsave" : "Save"}
            </Button>
            <Button as={Link} to={`/jobs/${job.id}`}>
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
