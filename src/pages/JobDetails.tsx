// src/pages/JobDetails.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import { useJob } from "../lib/hooks";
import { useAuth } from "../lib/AuthProvider";
import { supabase } from "../api/supabase";
import ApplyDrawer from "../components/ApplyDrawer";

export default function JobDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const { session, profile } = useAuth();

  const { data: job, isLoading } = useJob(id);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load saved-state for this job
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.user || !id) {
        if (!cancelled) setSaved(false);
        return;
      }
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("user_id", session.user.id)
        .eq("job_id", id)
        .maybeSingle();
      if (!cancelled) setSaved(!!data && !error);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, id]);

  const next = `/jobs/${encodeURIComponent(id ?? "")}`;

  async function toggleSave() {
    if (!session) {
      nav(`/auth?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!id) return;

    setSaving(true);
    try {
      if (saved) {
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("user_id", session.user.id)
          .eq("job_id", id);
        if (error) throw error;
        setSaved(false);
      } else {
        const { error } = await supabase
          .from("saved_jobs")
          .insert([{ user_id: session.user.id, job_id: id }]);
        // Ignore unique violation if user spam-clicks
        if (error && (error as any).code !== "23505") throw error;
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  if (isLoading)
    return <p className="text-gray-500 dark:text-gray-400">Loading…</p>;
  if (!job)
    return <p className="text-gray-500 dark:text-gray-400">Job not found</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{job.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {job.companies?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="info">{job.employment_type}</Badge>
          <Button
            color="light"
            onClick={toggleSave}
            disabled={saving}
            title={saved ? "Unsave job" : "Save job"}
          >
            {saving ? "..." : saved ? "Unsave" : "Save"}
          </Button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge color="gray">{job.location_type}</Badge>
        {job.tags?.map((t: string) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      {/* Apply guard */}
      {!session ? (
        <Button onClick={() => nav(`/auth?next=${encodeURIComponent(next)}`)}>
          Sign in to apply
        </Button>
      ) : profile?.role !== "seeker" ? (
        <Button disabled>Only seekers can apply</Button>
      ) : (
        <>
          <Button onClick={() => setDrawerOpen(true)}>Apply</Button>
          <ApplyDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            jobId={job.id}
          />
        </>
      )}
    </div>
  );
}
