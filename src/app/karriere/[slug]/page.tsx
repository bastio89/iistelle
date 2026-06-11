"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Company, Job } from "@/lib/types";
import ApplyModal from "@/components/ApplyModal";
import { ArrowRight, Briefcase, Clock, MapPin } from "lucide-react";

export default function CareerPage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deptFilter, setDeptFilter] = useState("alle");
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      setCompany((c as Company) ?? null);
      if (c) {
        const { data } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", (c as Company).id)
          .eq("status", "veroeffentlicht")
          .order("created_at", { ascending: false });
        setJobs((data as Job[]) ?? []);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-petrol-400">Lade Karriereseite…</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <h1 className="text-2xl font-bold text-petrol-900">Seite nicht gefunden</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Unter dieser Adresse gibt es keine Karriereseite. Bitte prüfe den Link.
        </p>
      </div>
    );
  }

  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort();
  const filtered =
    deptFilter === "alle" ? jobs : jobs.filter((j) => j.department === deptFilter);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-petrol-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 font-black text-white">
              {company.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-lg font-bold text-white">{company.name}</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            Mitarbeiter-Login
          </Link>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-14 pt-10">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white">
            Werde Teil unseres Teams
          </h1>
          <p className="mt-3 max-w-xl text-petrol-200">
            Finde die Rolle, die zu dir passt – die Bewerbung dauert keine zwei
            Minuten, Lebenslauf einfach anhängen.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-petrol-900">
            Offene Stellen ({filtered.length})
          </h2>
          <select
            className="input w-auto"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="alle">Alle Bereiche</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-petrol-500">
            Aktuell sind keine Stellen ausgeschrieben. Schau bald wieder vorbei!
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:shadow-cardHover"
              >
                <Link href={`/karriere/${slug}/${job.id}`} className="min-w-0">
                  <h3 className="font-bold text-petrol-900 hover:text-petrol-600">
                    {job.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-petrol-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {job.employment_type}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/karriere/${slug}/${job.id}`}
                    className="btn-secondary"
                  >
                    Details
                  </Link>
                  <button className="btn-primary" onClick={() => setApplyJob(job)}>
                    Jetzt bewerben <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-petrol-400">
          © {new Date().getFullYear()} {company.name} · Deine Daten werden
          DSGVO-konform verarbeitet und nur für den Bewerbungsprozess verwendet.
        </p>
      </main>

      {applyJob && (
        <ApplyModal
          job={applyJob}
          company={company}
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
}

