import { Link } from "react-router-dom";
import { useJobs } from "../lib/hooks";
import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";

export default function Jobs() {
  const { data: jobs, isLoading, isError, error } = useJobs();

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-center text-gray-500">
        Loading jobs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading jobs: {(error as Error).message}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <div className="p-6 text-center text-gray-500">No jobs found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        🚀 Available Jobs
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/jobs/${job.id}`}>
              <div className="group h-full rounded-2xl border bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                    {job.title}
                  </h2>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                    {job.employment_type}
                  </span>
                </div>

                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {job.description ?? "No description provided"}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    <span>{job.companies?.name ?? "Unknown company"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location_type}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
