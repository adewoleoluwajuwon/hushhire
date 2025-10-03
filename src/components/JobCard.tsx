import { Card, Badge, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import type { Job } from "../lib/types";

export default function JobCard({ job }: { job: Job }) {
  return (
    <Card className="transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded bg-gray-200" />
        <div className="flex-1">
          <div className="flex justify-between">
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
          <div className="mt-3 flex justify-end">
            <Button as={Link} to={`/jobs/${job.id}`}>
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
