import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import Footer from "@/components/Footer";

export default function RatgeberBase({
  children,
  title,
  excerpt,
  category,
  readTime,
  date,
  imageUrl,
  imageAlt,
}: {
  children: React.ReactNode;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const categoryColors: Record<string, string> = {
    Recruiting: "bg-sky-500",
    Mitarbeiter: "bg-emerald-500",
    Führung: "bg-violet-500",
    Recht: "bg-amber-500",
    Kultur: "bg-rose-500",
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <PublicNav />

      {/* Article Header */}
      <header className="mx-auto max-w-3xl px-6 py-10 bg-white">
        <Link
          href="/ratgeber"
          className="inline-flex items-center gap-2 text-sm font-semibold text-petrol-500 transition hover:text-petrol-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Alle Ratgeber
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${categoryColors[category] || "bg-petrol-500"}`}>
            {category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-petrol-500">
            <Clock className="h-3.5 w-3.5" />
            {readTime} Lesezeit
          </span>
          <span className="flex items-center gap-1.5 text-sm text-petrol-400">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold leading-tight text-petrol-900 md:text-4xl lg:text-5xl">
          {title}
        </h1>

        <div className="mt-6 flex items-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-petrol-100 px-4 py-2 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-200">
            <Share2 className="h-4 w-4" />
            Teilen
          </button>
        </div>
      </header>

      {/* Article Image */}
      {imageUrl && (
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10 lg:p-12">
          {/* Lead paragraph */}
          <p className="article-lead">
            {excerpt}
          </p>

          {/* Content */}
          <div className="article-content">
            {children}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-petrol-800 to-petrol-900 shadow-xl">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-500/20 text-coral-400">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  Mehr HR-Wissen gefällig?
                </h3>
                <p className="mt-2 text-petrol-300">
                  Entdecke weitere kostenlose Ratgeber und Tools für dein HR-Management.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/ratgeber" className="btn-primary text-sm">
                    Alle Ratgeber
                  </Link>
                  <Link href="/services" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                    Kostenlose Tools
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h3 className="mb-6 text-lg font-bold text-petrol-900">Das könnte dich auch interessieren</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/ratgeber/onboarding" className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-petrol-900 group-hover:text-coral-500 transition">
                Onboarding optimieren
              </h4>
              <p className="text-sm text-petrol-500">Die ersten 90 Tage</p>
            </div>
          </Link>
          <Link href="/ratgeber/mitarbeiterzufriedenheit" className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-petrol-900 group-hover:text-coral-500 transition">
                Mitarbeiterzufriedenheit
              </h4>
              <p className="text-sm text-petrol-500">Fluktuation reduzieren</p>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}