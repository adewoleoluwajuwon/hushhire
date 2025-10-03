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
import { useApply } from "../lib/hooks";

export default function ApplyDrawer({
  open,
  onClose,
  jobId,
}: {
  open: boolean;
  onClose: () => void;
  jobId: string;
}) {
  const apply = useApply();
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      await apply.mutateAsync({
        job_id: jobId,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
      });
      onClose();
    } catch (e: any) {
      setError(e.message);
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
            />
          </div>
          <div>
            <Label>Cover letter</Label>
            <Textarea
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
          {error && <Alert color="failure">{error}</Alert>}
          <Button onClick={submit} className="w-full">
            Submit application
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
}
