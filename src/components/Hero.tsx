import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";

interface HeroProps {
  badge?: {
    icon?: React.ReactNode;
    text: string;
  };
  title: string | React.ReactNode;
  subtitle?: string;
  showCtas?: boolean;
  showProductPreview?: boolean;
}

export default function Hero({ badge, title, subtitle, showCtas = false, showProductPreview = false }: HeroProps) {
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-petrol-900">iistelle</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-petrol-600">
            <ServiceDropdown />
            <Link href="/hilfecenter" className="transition hover:text-petrol-900">Hilfecenter</Link>
            <Link href="/preise" className="transition hover:text-petrol-900">Preise</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-50">
              Anmelden
            </Link>
            <Link href="/login" className="btn-primary">
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-petrol-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 20%, rgba(255,90,80,0.25) 0%, transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(69,144,154,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
              {badge.icon || <Sparkles className="h-3.5 w-3.5 text-coral-400" />}
              {badge.text}
            </div>
          )}

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-petrol-300">
              {subtitle}
            </p>
          )}

          {(showCtas || showProductPreview) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login" className="btn-danger group px-6 py-3 text-base">
                14 Tage kostenlos testen
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {showProductPreview && (
                <a
                  href="/karriere/iistelle"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/10"
                >
                  <Star className="h-4 w-4" />
                  Produkt ansehen
                </a>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}