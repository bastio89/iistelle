"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Users,
  CalendarClock,
  BarChart3,
  UserCircle,
  Plane,
  Wallet,
  TrendingUp,
  Settings,
  Mail,
  Globe,
  Network,
  CreditCard,
  ListTodo,
} from "lucide-react";
import { useRole } from "@/lib/useRole";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/aufgaben", label: "Aufgaben", icon: ListTodo },
];

const recruitingNav = [
  { href: "/recruiting", label: "Stellen", icon: Briefcase, exact: true },
  { href: "/recruiting/bewerbungen", label: "Bewerbungen", icon: KanbanSquare },
  { href: "/recruiting/kandidaten", label: "Kandidaten", icon: Users },
  { href: "/recruiting/interviews", label: "Interviews", icon: CalendarClock },
  { href: "/recruiting/vorlagen", label: "E-Mail-Vorlagen", icon: Mail },
  { href: "/recruiting/auswertungen", label: "Auswertungen", icon: BarChart3 },
];

const moreNav = [
  { href: "/mitarbeiter", label: "Mitarbeiter", icon: UserCircle },
  { href: "/organigramm", label: "Organigramm", icon: Network },
  { href: "/abwesenheiten", label: "Abwesenheiten", icon: Plane },
  { href: "/gehalt", label: "Gehalt", icon: Wallet, adminOnly: true },
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/abrechnung", label: "Abrechnung", icon: CreditCard, adminOnly: true },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-white/10 text-white"
          : "text-petrol-200 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] ${
          active ? "text-coral-400" : "text-petrol-300 group-hover:text-coral-400"
        }`}
      />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const { isAdmin, company } = useRole();
  const visibleMoreNav = moreNav.filter((item) => !item.adminOnly || isAdmin);
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-petrol-950 px-3 py-5">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 font-black text-white">
          ii
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          iistelle HR
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-petrol-400">
            Recruiting
          </p>
          <div className="space-y-1">
            {recruitingNav.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-petrol-400">
            Weitere Module
          </p>
          <div className="space-y-1">
            {visibleMoreNav.map(({ href, label, icon }) => (
              <NavLink key={href} href={href} label={label} icon={icon} />
            ))}
          </div>
        </div>
      </nav>

      <a
        href={company ? `/karriere/${company.slug}` : "/karriere"}
        target="_blank"
        className="mt-4 flex items-center gap-2.5 rounded-xl bg-white/5 p-3 text-xs text-petrol-300 transition hover:bg-white/10"
      >
        <Globe className="h-4 w-4 shrink-0 text-coral-400" />
        <span>
          <span className="block font-semibold text-white">Karriereseite</span>
          {company ? company.name : "öffentliche Stellen ansehen"}
        </span>
      </a>
    </aside>
  );
}
