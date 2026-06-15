'use client';

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Mail,
  BookMarked,
  Briefcase,
  UserPlus,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

const ChevronDown = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Mega-Dropdown Service ─────────────────────────────────────────────────────
export function ServiceDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    timer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  useEffect(() => {
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-semibold text-petrol-600 transition-colors hover:text-petrol-900"
      >
        Services
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Mega-menu panel */}
      <div
        className={`absolute left-1/2 top-full z-50 mt-2 w-[760px] -translate-x-1/2 rounded-2xl border border-petrol-100 bg-white shadow-xl transition-all duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <div className="grid grid-cols-3 divide-x divide-petrol-50 p-4">
          {/* Links: Hilfe & Support */}
          <div className="pr-4">
            <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-petrol-400">
              Hilfe &amp; Support
            </p>
            <Link href="/ratgeber" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral-50 text-coral-500">
                <BookOpen size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Ratgeber</p>
                <p className="text-xs text-petrol-500">HR-Wissen kompakt erklärt</p>
              </div>
            </Link>
            <Link href="/services" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral-50 text-coral-500">
                <HelpCircle size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Services</p>
                <p className="text-xs text-petrol-500">Tools, Vorlagen und Anleitungen</p>
              </div>
            </Link>
            <a href="mailto:hello@twenty5ai.com" className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-petrol-100 text-petrol-500">
                <Mail size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Kontakt</p>
                <p className="text-xs text-petrol-500">hello@twenty5ai.com</p>
              </div>
            </a>
          </div>

          {/* Mitte: Beliebte Ratgeber */}
          <div className="px-4">
            <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-petrol-400">
              Beliebte Ratgeber
            </p>
            <Link href="/ratgeber/stellenanzeige-schreiben" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Briefcase size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Stellenanzeige schreiben</p>
                <p className="text-xs text-petrol-500">So schreibst du Texte, die ziehen</p>
              </div>
            </Link>
            <Link href="/ratgeber/onboarding" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <UserPlus size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Onboarding optimieren</p>
                <p className="text-xs text-petrol-500">Vom ersten Tag bis zum 90-Tage-Gespräch</p>
              </div>
            </Link>
            <Link href="/ratgeber/feedbackgespraeche" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <MessageSquare size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Feedbackgespräche führen</p>
                <p className="text-xs text-petrol-500">So gibst du konstruktives Feedback</p>
              </div>
            </Link>
          </div>

          {/* Rechts: Nützliche Services */}
          <div className="pl-4">
            <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-petrol-400">
              Nützliche Services
            </p>
            <Link href="/ratgeber" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <BookMarked size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">HR-Ratgeber</p>
                <p className="text-xs text-petrol-500">Tipps zu Recruiting, Onboarding &amp; mehr</p>
              </div>
            </Link>
            <Link href="/recruiting/vorlagen" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <FileText size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Stellenvorlagen</p>
                <p className="text-xs text-petrol-500">Vorlagen für Stellenanzeigen</p>
              </div>
            </Link>
            <Link href="/recruiting/interviews" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-petrol-50">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <Users size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-petrol-900">Interview-Leitfaden</p>
                <p className="text-xs text-petrol-500">Strukturierte Gesprächsführung</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer strip */}
        <div className="grid grid-cols-2 divide-x divide-petrol-100 rounded-b-2xl border-t border-petrol-100 bg-petrol-50">
          <Link href="/ratgeber" onClick={() => setOpen(false)} className="flex items-center justify-between px-5 py-3 text-sm font-medium text-coral-600 hover:text-coral-700">
            <span>Alle Ratgeber anzeigen</span>
            <ArrowRight size={14} />
          </Link>
          <Link href="/services" onClick={() => setOpen(false)} className="flex items-center justify-between px-5 py-3 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            <span>Alle Services anzeigen</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}