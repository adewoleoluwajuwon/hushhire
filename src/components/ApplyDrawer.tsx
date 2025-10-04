/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Drawer,
  Button,
  Label,
  Textarea,
  TextInput,
  Alert,
  DrawerHeader,
  DrawerItems,
} from "flowbite-react";
import { useState } from "react";
import { supabase } from "../api/supabase";
import { useAuth } from "../lib/AuthProvider";
import { toast } from "react-hot-toast";

export default function ApplyDrawer({
  open,
  onClose,
  jobId,
}: {
  open: boolean;
  onClose: () => void;
  jobId: string;
}) {
  const { session } = useAuth();

  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);

    if (!session?.user) {
      setError("You must be signed in to apply.");
      toast.error("Please sign in to apply.");
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("applications")
        .insert([
          {
            job_id: jobId,
            seeker_id: session.user.id,
            cover_letter: coverLetter || null,
            resume_url: resumeUrl || null,
            status: "submitted",
          },
        ])
        .select()
        .single();

      if (error) {
        // Duplicate (unique violation) or RLS/permission denied
        const code = String((error as any).code ?? "");
        const msg = `${error.message ?? ""} ${
          error.details ?? ""
        }`.toLowerCase();

        if (code === "23505") {
          toast.error("You’ve already applied to this job.");
        } else if (
          code === "42501" ||
          /permission denied|row-level security|rls/.test(msg)
        ) {
          toast.error(
            "Unable to submit application. Please check your account and try again."
          );
        } else {
          toast.error(error.message ?? "Unable to submit application.");
        }

        // Also surface inline for non-toast UIs
        setError(
          code === "23505"
            ? "You’ve already applied to this job."
            : "Unable to submit application. Please check your account and try again."
        );
        return;
      }

      toast.success("Application submitted!");
      // Optional: clear fields
      setResumeUrl("");
      setCoverLetter("");
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Unable to submit application.");
      toast.error(e?.message ?? "Unable to submit application.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} position="right">
      <DrawerHeader title="Apply for this job" />
      <DrawerItems>
        <div className="space-y-3">
          <div>
            <Label>Resume URL</Label>
            <TextInput
              placeholder="https://drive.google.com/…"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              disabled={busy}
            />
          </div>
          <div>
            <Label>Cover letter</Label>
            <Textarea
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={busy}
            />
          </div>

          {error && <Alert color="failure">{error}</Alert>}

          <Button onClick={submit} className="w-full" disabled={busy}>
            {busy ? "Submitting…" : "Submit application"}
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
}
