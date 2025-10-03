/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInput, Select, Button } from "flowbite-react";

export type JobFilters = {
  query: string;
  employment_type:
    | "any"
    | "full-time"
    | "part-time"
    | "contract"
    | "internship";
  location_type: "any" | "onsite" | "hybrid" | "remote";
};

export default function JobFiltersBar({
  value,
  onChange,
}: {
  value: JobFilters;
  onChange: (v: JobFilters) => void;
}) {
  const set = (k: keyof JobFilters, v: any) => onChange({ ...value, [k]: v });
  const reset = () =>
    onChange({ query: "", employment_type: "any", location_type: "any" });
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="flex-1">
        <TextInput
          placeholder="Search job titles (e.g. React Developer)"
          value={value.query}
          onChange={(e) => set("query", e.target.value)}
        />
      </div>
      <Select
        value={value.employment_type}
        onChange={(e) => set("employment_type", e.target.value)}
      >
        <option value="any">Any type</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </Select>
      <Select
        value={value.location_type}
        onChange={(e) => set("location_type", e.target.value)}
      >
        <option value="any">Any location</option>
        <option value="onsite">On-site</option>
        <option value="hybrid">Hybrid</option>
        <option value="remote">Remote</option>
      </Select>
      <Button color="light" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}
