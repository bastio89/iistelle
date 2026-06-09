export type JobStatus = "entwurf" | "veroeffentlicht" | "pausiert" | "geschlossen";

export type Stage =
  | "eingang"
  | "screening"
  | "interview"
  | "angebot"
  | "eingestellt"
  | "abgelehnt";

export const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: "eingang", label: "Eingang", color: "bg-sky-100 text-sky-800" },
  { key: "screening", label: "Screening", color: "bg-violet-100 text-violet-800" },
  { key: "interview", label: "Interview", color: "bg-amber-100 text-amber-800" },
  { key: "angebot", label: "Angebot", color: "bg-teal-100 text-teal-800" },
  { key: "eingestellt", label: "Eingestellt", color: "bg-emerald-100 text-emerald-800" },
  { key: "abgelehnt", label: "Abgelehnt", color: "bg-rose-100 text-rose-700" },
];

export const JOB_STATUS_META: Record<JobStatus, { label: string; color: string }> = {
  entwurf: { label: "Entwurf", color: "bg-slate-100 text-slate-700" },
  veroeffentlicht: { label: "Veröffentlicht", color: "bg-emerald-100 text-emerald-800" },
  pausiert: { label: "Pausiert", color: "bg-amber-100 text-amber-800" },
  geschlossen: { label: "Geschlossen", color: "bg-slate-200 text-slate-600" },
};

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  seniority: string | null;
  status: JobStatus;
  description: string | null;
  recruiter: string | null;
  target_hires: number;
  channels: string[];
  created_at: string;
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  linkedin: string | null;
  source: string | null;
  cv_summary: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  stage: Stage;
  rating: number | null;
  salary_expectation: string | null;
  notes: string | null;
  rejected_reason: string | null;
  applied_at: string;
  updated_at: string;
  job?: Job;
  candidate?: Candidate;
}

export interface Interview {
  id: string;
  application_id: string;
  title: string;
  interview_type: "telefon" | "video" | "vor_ort";
  scheduled_at: string;
  duration_min: number;
  interviewer: string;
  status: "geplant" | "abgeschlossen" | "abgesagt";
  notes: string | null;
  application?: Application;
}

export interface Evaluation {
  id: string;
  application_id: string;
  interviewer: string;
  score: number;
  recommendation: "einstellen" | "unentschieden" | "ablehnen";
  comments: string | null;
  created_at: string;
}

export const INTERVIEW_TYPE_LABEL: Record<Interview["interview_type"], string> = {
  telefon: "Telefon",
  video: "Video-Call",
  vor_ort: "Vor Ort",
};
