"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Absence, Application, Candidate, Employee, Interview, Job } from "@/lib/types";
import { formatDateTime } from "@/components/ui";
import {
  Bell,
  Briefcase,
  CalendarClock,
  Inbox,
  LogOut,
  Plane,
  Search,
  UserCircle,
  Users,
} from "lucide-react";

interface SearchResults {
  candidates: Candidate[];
  employees: Employee[];
  jobs: Job[];
}

interface Notice {
  id: string;
  icon: React.ElementType;
  title: string;
  detail: string;
  href: string;
  tone: string;
}

export default function Topbar() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Suche
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Benachrichtigungen
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const noticesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName((data.user?.user_metadata?.full_name as string) ?? "");
    });
    loadNotices();

    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (noticesRef.current && !noticesRef.current.contains(e.target as Node)) {
        setNoticesOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadNotices() {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const in48h = new Date(Date.now() + 48 * 3600000).toISOString();
    const now = new Date().toISOString();

    const [absences, applications, interviews] = await Promise.all([
      supabase
        .from("absences")
        .select("*, employee:employees(first_name,last_name)")
        .eq("status", "beantragt")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("applications")
        .select("*, candidate:candidates(first_name,last_name), job:jobs(title)")
        .eq("stage", "eingang")
        .gte("applied_at", weekAgo)
        .order("applied_at", { ascending: false })
        .limit(5),
      supabase
        .from("interviews")
        .select("*, application:applications(candidate:candidates(first_name,last_name))")
        .eq("status", "geplant")
        .gte("scheduled_at", now)
        .lte("scheduled_at", in48h)
        .order("scheduled_at")
        .limit(5),
    ]);

    const list: Notice[] = [];
    ((absences.data as Absence[]) ?? []).forEach((a) =>
      list.push({
        id: `abs-${a.id}`,
        icon: Plane,
        title: "Offener Abwesenheitsantrag",
        detail: `${a.employee?.first_name} ${a.employee?.last_name} · ${a.days} Tage`,
        href: "/abwesenheiten",
        tone: "bg-amber-50 text-amber-600",
      })
    );
    ((applications.data as Application[]) ?? []).forEach((a) =>
      list.push({
        id: `app-${a.id}`,
        icon: Inbox,
        title: "Neue Bewerbung",
        detail: `${a.candidate?.first_name} ${a.candidate?.last_name} · ${a.job?.title}`,
        href: `/recruiting/kandidaten/${a.candidate_id}`,
        tone: "bg-sky-50 text-sky-600",
      })
    );
    ((interviews.data as Interview[]) ?? []).forEach((iv) =>
      list.push({
        id: `iv-${iv.id}`,
        icon: CalendarClock,
        title: "Interview in Kürze",
        detail: `${iv.application?.candidate?.first_name} ${iv.application?.candidate?.last_name} · ${formatDateTime(iv.scheduled_at)}`,
        href: "/recruiting/interviews",
        tone: "bg-violet-50 text-violet-600",
      })
    );
    setNotices(list);
  }

  async function runSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults(null);
      return;
    }
    const term = `%${q.trim()}%`;
    const [c, e, j] = await Promise.all([
      supabase
        .from("candidates")
        .select("*")
        .or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`)
        .limit(5),
      supabase
        .from("employees")
        .select("*")
        .or(`first_name.ilike.${term},last_name.ilike.${term},position.ilike.${term}`)
        .limit(5),
      supabase.from("jobs").select("*").ilike("title", term).limit(5),
    ]);
    setResults({
      candidates: (c.data as Candidate[]) ?? [],
      employees: (e.data as Employee[]) ?? [],
      jobs: (j.data as Job[]) ?? [],
    });
    setSearchOpen(true);
  }

  function go(href: string) {
    setSearchOpen(false);
    setQuery("");
    setResults(null);
    router.push(href);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const hasResults =
    results &&
    results.candidates.length + results.employees.length + results.jobs.length > 0;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-petrol-100 bg-white/90 px-6 backdrop-blur">
      {/* Globale Suche */}
      <div ref={searchRef} className="relative w-80">
        <div className="flex items-center gap-2 rounded-lg border border-petrol-100 bg-surface px-3 py-1.5">
          <Search className="h-4 w-4 shrink-0 text-petrol-400" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-petrol-400"
            placeholder="Kandidaten, Mitarbeiter, Stellen suchen…"
            value={query}
            onChange={(e) => runSearch(e.target.value)}
            onFocus={() => results && setSearchOpen(true)}
          />
        </div>

        {searchOpen && results && (
          <div className="card absolute left-0 top-11 max-h-96 w-96 overflow-y-auto p-2">
            {!hasResults && (
              <p className="px-3 py-4 text-center text-sm text-petrol-400">
                Keine Treffer für „{query}“
              </p>
            )}
            {results.candidates.length > 0 && (
              <SearchGroup label="Kandidaten" icon={Users}>
                {results.candidates.map((c) => (
                  <SearchItem
                    key={c.id}
                    title={`${c.first_name} ${c.last_name}`}
                    detail={c.email}
                    onClick={() => go(`/recruiting/kandidaten/${c.id}`)}
                  />
                ))}
              </SearchGroup>
            )}
            {results.employees.length > 0 && (
              <SearchGroup label="Mitarbeiter" icon={UserCircle}>
                {results.employees.map((e) => (
                  <SearchItem
                    key={e.id}
                    title={`${e.first_name} ${e.last_name}`}
                    detail={e.position}
                    onClick={() => go(`/mitarbeiter/${e.id}`)}
                  />
                ))}
              </SearchGroup>
            )}
            {results.jobs.length > 0 && (
              <SearchGroup label="Stellen" icon={Briefcase}>
                {results.jobs.map((j) => (
                  <SearchItem
                    key={j.id}
                    title={j.title}
                    detail={`${j.department} · ${j.location}`}
                    onClick={() => go(`/recruiting/jobs/${j.id}`)}
                  />
                ))}
              </SearchGroup>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Benachrichtigungen */}
        <div ref={noticesRef} className="relative">
          <button
            className="relative rounded-lg p-2 text-petrol-500 transition hover:bg-petrol-50"
            onClick={() => setNoticesOpen((o) => !o)}
          >
            <Bell className="h-5 w-5" />
            {notices.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
                {notices.length}
              </span>
            )}
          </button>

          {noticesOpen && (
            <div className="card absolute right-0 top-11 max-h-96 w-96 overflow-y-auto">
              <p className="border-b border-petrol-50 px-4 py-3 text-sm font-bold text-petrol-900">
                Benachrichtigungen
              </p>
              {notices.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-petrol-400">
                  Alles erledigt – keine offenen Punkte.
                </p>
              ) : (
                <ul className="divide-y divide-petrol-50">
                  {notices.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        onClick={() => setNoticesOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition hover:bg-petrol-50/60"
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.tone}`}>
                          <n.icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-petrol-900">
                            {n.title}
                          </span>
                          <span className="block text-xs text-petrol-400">{n.detail}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-petrol-800 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-petrol-900">
              {name || "Nutzer"}
            </p>
            <p className="text-xs leading-tight text-petrol-400">{email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Abmelden"
          className="rounded-lg p-2 text-petrol-500 transition hover:bg-coral-500 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function SearchGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-petrol-400">
        <Icon className="h-3 w-3" /> {label}
      </p>
      {children}
    </div>
  );
}

function SearchItem({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col rounded-lg px-3 py-2 text-left transition hover:bg-petrol-50"
    >
      <span className="text-sm font-semibold text-petrol-900">{title}</span>
      <span className="text-xs text-petrol-400">{detail}</span>
    </button>
  );
}
