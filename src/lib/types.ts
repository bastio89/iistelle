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

/* ---------- HR-Module ---------- */

export type EmployeeStatus = "onboarding" | "aktiv" | "ausgeschieden";

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string;
  location: string | null;
  employment_type: string;
  status: EmployeeStatus;
  hire_date: string;
  manager: string | null;
  vacation_days_per_year: number;
  candidate_id: string | null;
  created_at: string;
}

export const EMPLOYEE_STATUS_META: Record<
  EmployeeStatus,
  { label: string; color: string }
> = {
  onboarding: { label: "Onboarding", color: "bg-sky-100 text-sky-800" },
  aktiv: { label: "Aktiv", color: "bg-emerald-100 text-emerald-800" },
  ausgeschieden: { label: "Ausgeschieden", color: "bg-slate-200 text-slate-600" },
};

export type AbsenceType = "urlaub" | "krank" | "sonderurlaub" | "unbezahlt";
export type AbsenceStatus = "beantragt" | "genehmigt" | "abgelehnt";

export interface Absence {
  id: string;
  employee_id: string;
  absence_type: AbsenceType;
  start_date: string;
  end_date: string;
  days: number;
  status: AbsenceStatus;
  comment: string | null;
  created_at: string;
  employee?: Employee;
}

export const ABSENCE_TYPE_META: Record<AbsenceType, { label: string; color: string }> = {
  urlaub: { label: "Urlaub", color: "bg-teal-100 text-teal-800" },
  krank: { label: "Krankheit", color: "bg-rose-100 text-rose-700" },
  sonderurlaub: { label: "Sonderurlaub", color: "bg-violet-100 text-violet-800" },
  unbezahlt: { label: "Unbezahlt", color: "bg-slate-100 text-slate-700" },
};

export const ABSENCE_STATUS_META: Record<AbsenceStatus, { label: string; color: string }> = {
  beantragt: { label: "Beantragt", color: "bg-amber-100 text-amber-800" },
  genehmigt: { label: "Genehmigt", color: "bg-emerald-100 text-emerald-800" },
  abgelehnt: { label: "Abgelehnt", color: "bg-rose-100 text-rose-700" },
};

export interface Salary {
  id: string;
  employee_id: string;
  amount: number;
  pay_interval: "monatlich" | "jaehrlich";
  effective_from: string;
  note: string | null;
  created_at: string;
  employee?: Employee;
}

export type GoalStatus = "offen" | "in_arbeit" | "erreicht" | "verfehlt";

export interface Goal {
  id: string;
  employee_id: string;
  title: string;
  description: string | null;
  progress: number;
  due_date: string | null;
  status: GoalStatus;
  created_at: string;
  employee?: Employee;
}

export const GOAL_STATUS_META: Record<GoalStatus, { label: string; color: string }> = {
  offen: { label: "Offen", color: "bg-slate-100 text-slate-700" },
  in_arbeit: { label: "In Arbeit", color: "bg-sky-100 text-sky-800" },
  erreicht: { label: "Erreicht", color: "bg-emerald-100 text-emerald-800" },
  verfehlt: { label: "Verfehlt", color: "bg-rose-100 text-rose-700" },
};

export interface Review {
  id: string;
  employee_id: string;
  reviewer: string;
  cycle: string;
  score: number;
  strengths: string | null;
  improvements: string | null;
  created_at: string;
  employee?: Employee;
}

export interface CompanySettings {
  id: number;
  company_name: string;
  default_vacation_days: number;
  probation_months: number;
  updated_at: string;
}

export interface OnboardingTask {
  id: string;
  employee_id: string;
  title: string;
  done: boolean;
  due_date: string | null;
  sort_order: number;
  created_at: string;
}

export type TemplateType =
  | "einladung"
  | "zusage"
  | "absage"
  | "eingangsbestaetigung"
  | "sonstige";

export interface EmailTemplate {
  id: string;
  name: string;
  template_type: TemplateType;
  subject: string;
  body: string;
  created_at: string;
}

export const TEMPLATE_TYPE_META: Record<TemplateType, { label: string; color: string }> = {
  eingangsbestaetigung: { label: "Eingangsbestätigung", color: "bg-sky-100 text-sky-800" },
  einladung: { label: "Einladung", color: "bg-violet-100 text-violet-800" },
  zusage: { label: "Zusage", color: "bg-emerald-100 text-emerald-800" },
  absage: { label: "Absage", color: "bg-rose-100 text-rose-700" },
  sonstige: { label: "Sonstige", color: "bg-slate-100 text-slate-700" },
};

export const DEFAULT_ONBOARDING_TASKS = [
  "Arbeitsvertrag unterschrieben zurückerhalten",
  "Hardware bestellen (Laptop, Monitor, Zubehör)",
  "Accounts anlegen (E-Mail, Slack, HR-Tool)",
  "Buddy / Patin zuweisen",
  "Onboarding-Plan für Woche 1 erstellen",
  "Team über Start informieren",
  "Erster Arbeitstag: Begrüßung & Rundgang",
  "Feedbackgespräch nach 30 Tagen einplanen",
];

export type DocCategory = "vertrag" | "zeugnis" | "bescheinigung" | "sonstige";

export interface HrDocument {
  id: string;
  employee_id: string;
  name: string;
  category: DocCategory;
  storage_path: string;
  size_bytes: number;
  created_at: string;
}

export const DOC_CATEGORY_META: Record<DocCategory, { label: string; color: string }> = {
  vertrag: { label: "Vertrag", color: "bg-petrol-100 text-petrol-700" },
  zeugnis: { label: "Zeugnis", color: "bg-violet-100 text-violet-800" },
  bescheinigung: { label: "Bescheinigung", color: "bg-sky-100 text-sky-800" },
  sonstige: { label: "Sonstige", color: "bg-slate-100 text-slate-700" },
};

export type UserRole = "admin" | "manager" | "mitarbeiter";

export interface UserRoleRow {
  user_id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-coral-500 text-white" },
  manager: { label: "Manager", color: "bg-petrol-700 text-white" },
  mitarbeiter: { label: "Mitarbeiter", color: "bg-petrol-100 text-petrol-700" },
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
