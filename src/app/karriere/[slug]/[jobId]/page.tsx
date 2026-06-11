"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Company, Job } from "@/lib/types";
import ApplyModal from "@/components/ApplyModal";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  Link2,
  MapPin,
  Users,
} from "lucide-react";

export default function PublicJobDetailPage() {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();
  const supabase = createClient();
  const [company, setCompany] = useState<Company | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [copied, setCopied] = useState(false);
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
        const { data: j } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .eq("company_id", (c as Company).id)
          .eq("status", "veroeffentlicht")
          .maybeSingle();
        setJob((j as Job) ?? null);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, jobId]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-petrol-400">Lade Stelle…</p>
      </div>
    );
  }

  if (!company || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <h1 className="text-2xl font-bold text-petrol-900">
          Stelle nicht gefunden
        </h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Diese Stelle existiert nicht oder ist nicht mehr ausgeschrieben.
        </p>
        <Link href={`/karriere/${slug}`} className="btn-primary mt-6">
          Alle offenen Stellen
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-petrol-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href={`/karriere/${slug}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 font-black text-white">
              {company.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-lg font-bold text-white">{company.name}</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            Mitarbeiter-Login
          </Link>
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-12 pt-8">
          <Link
            href={`/karriere/${slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Alle offenen Stellen
          </Link>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-petrol-200">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {job.employment_type}
            </span>
            {job.seniority && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {job.seniority}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-danger px-6 py-3" onClick={() => setShowApply(true)}>
            Jetzt bewerben <ArrowRight className="h-4 w-4" />
          </button>
          <button className="btn-secondary py-3" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Link kopiert" : "Stelle teilen"}
          </button>
        </div>

        <div className="card mt-8 p-8">
          <h2 className="text-lg font-bold text-petrol-900">Über die Position</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-petrol-700">
            {job.description || "Für diese Position liegt noch keine ausführliche Beschreibung vor. Bewirb dich gerne direkt – wir erzählen dir im Gespräch alles Wichtige."}
          </p>
        </div>

        <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 bg-petrol-950 p-8">
          <div>
            <h2 className="text-lg font-bold text-white">Klingt nach dir?</h2>
            <p className="mt-1 text-sm text-petrol-200">
              Die Bewerbung dauert keine zwei Minuten – Lebenslauf optional anhängen.
            </p>
          </div>
          <button className="btn-danger" onClick={() => setShowApply(true)}>
            Jetzt bewerben <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-petrol-400">
          © {new Date().getFullYear()} {company.name} · Deine Daten werden
          DSGVO-konform verarbeitet und nur für den Bewerbungsprozess verwendet.
        </p>
      </main>

      {showApply && (
        <ApplyModal job={job} company={company} onClose={() => setShowApply(false)} />
      )}
    </div>
  );
}
