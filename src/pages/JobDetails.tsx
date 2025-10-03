import { useParams } from "react-router-dom";
import { Button, Badge } from "flowbite-react";
import { useState } from "react";
import { useJob } from "../lib/hooks";
import ApplyDrawer from "../components/ApplyDrawer";

export default function JobDetail() {
  const { id } = useParams();
  const { data: job, isLoading } = useJob(id);
  const [open, setOpen] = useState(false);
  if (isLoading)
    return <p className="text-gray-500 dark:text-gray-400">Loading…</p>;
  if (!job)
    return <p className="text-gray-500 dark:text-gray-400">Job not found</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{job.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {job.companies?.name}
          </p>
        </div>
        <Badge color="info">{job.employment_type}</Badge>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>
      <div className="flex gap-2">
        <Badge color="gray">{job.location_type}</Badge>
        {job.tags?.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <Button onClick={() => setOpen(true)}>Apply</Button>
      <ApplyDrawer open={open} onClose={() => setOpen(false)} jobId={job.id} />
    </div>
  );
}
