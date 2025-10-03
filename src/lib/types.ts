export type Role = "seeker" | "employer";

export type Profile = {
  user_id: string;
  full_name: string | null;
  role: Role | null;
  headline: string | null;
  location: string | null;
  avatar_url: string | null;
  company_id: string | null;
};

export type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  about: string | null;
  created_by: string;
  created_at: string;
};

export type Job = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  employment_type: "full-time" | "part-time" | "contract" | "internship";
  location_type: "onsite" | "hybrid" | "remote";
  location_text: string | null;
  min_salary: number | null;
  max_salary: number | null;
  currency: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  companies?: Pick<Company, "name" | "logo_url">;
};

export type Application = {
  id: string;
  job_id: string;
  seeker_id: string;
  cover_letter: string | null;
  resume_url: string | null;
  status: "submitted" | "reviewed" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
};
