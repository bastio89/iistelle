import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, ArrowLeft, Mail, CheckCircle, Sparkles, Send, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Company, Job } from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug, id } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!company) return { title: "Unternehmen nicht gefunden" };

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!job) return { title: "Stelle nicht gefunden" };

  return {
    title: `${job.title} – ${company.name} Karriere`,
    description: job.description?.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!company) notFound();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!job) notFound();

  const { data: otherJobs } = await supabase
    .from("jobs")
    .select("id, title, department, location, employment_type")
    .eq("company_id", company.id)
    .eq("status", "veroeffentlicht")
    .neq("id", id)
    .limit(3);

  const brandColor = company.brand_color || "#0f2e34";

  const requirements = job.requirements ? JSON.parse(job.requirements) : [];
  const responsibilities = job.responsibilities ? JSON.parse(job.responsibilities) : [];
  const niceToHave = job.nice_to_have ? JSON.parse(job.nice_to_have) : [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <header style={{ backgroundColor: brandColor }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-9 w-9 rounded-lg bg-white/90 object-contain p-1"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 font-black text-white">
                {company.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span className="text-lg font-bold text-white">{company.name}</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            Mitarbeiter-Login
          </Link>
        </div>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href={`/karriere/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle Stellen
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              {job.employment_type}
            </span>
            <span className="flex items-center gap-1 text-sm text-petrol-300">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            {job.department && (
              <span className="flex items-center gap-1 text-sm text-petrol-300">
                <Sparkles className="h-4 w-4" />
                {job.department}
              </span>
            )}
            {job.application_deadline && (
              <span className="rounded-full bg-coral-500/30 px-3 py-1 text-xs font-semibold text-white">
                Bewirb dich bis {new Date(job.application_deadline).toLocaleDateString("de-DE")}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {job.title}
          </h1>
          {job.description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-petrol-200">
              {job.description}
            </p>
          )}
          <div className="mt-8">
            <a
              href={`mailto:${company.career_email || "jobs@twenty5ai.com"}?subject=Bewerbung%3A%20${encodeURIComponent(job.title)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-coral-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-coral-600"
            >
              <Mail className="h-5 w-5" />
              Jetzt bewerben
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Aufgaben */}
            {responsibilities.length > 0 && (
              <section>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-petrol-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  Deine Aufgaben
                </h2>
                <ul className="space-y-3">
                  {responsibilities.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-petrol-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Anforderungen */}
            {requirements.length > 0 && (
              <section>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-petrol-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  Das bringst du mit
                </h2>
                <ul className="space-y-3">
                  {requirements.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                      <span className="text-petrol-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Nice to have */}
            {niceToHave.length > 0 && (
              <section>
                <h2 className="mb-6 text-xl font-bold text-petrol-900">
                  Nice to have
                </h2>
                <ul className="space-y-3">
                  {niceToHave.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-petrol-400" />
                      <span className="text-petrol-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold text-petrol-900">Interessiert?</h3>
              <p className="mt-2 text-sm text-petrol-600">
                Wir freuen uns auf deine Bewerbung!
              </p>
              <a
                href={`mailto:${company.career_email || "jobs@twenty5ai.com"}?subject=Bewerbung%3A%20${encodeURIComponent(job.title)}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-coral-500 px-4 py-3 font-semibold text-white transition hover:bg-coral-600"
              >
                <Mail className="h-4 w-4" />
                Jetzt bewerben
              </a>
              <div className="mt-6 border-t border-petrol-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow">
                    <Image
                      src="/sebastian.webp"
                      alt="Sebastian Oczachowski"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">{company.name}</p>
                    <p className="text-sm text-petrol-500">Recruiting Team</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Other Jobs */}
      {otherJobs && otherJobs.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-petrol-900">
            Weitere offene Stellen
          </h2>
          <div className="space-y-3">
            {otherJobs.map((otherJob) => (
              <div
                key={otherJob.id}
                className="card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:shadow-cardHover"
              >
                <div>
                  <h3 className="font-bold text-petrol-900">{otherJob.title}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-petrol-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" /> {otherJob.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {otherJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {otherJob.employment_type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/karriere/${slug}/${otherJob.id}`}
                    className="btn-secondary"
                  >
                    Details
                  </Link>
                  <a
                    href={`mailto:${company.career_email || "jobs@twenty5ai.com"}?subject=Bewerbung%3A%20${encodeURIComponent(otherJob.title)}`}
                    className="btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}