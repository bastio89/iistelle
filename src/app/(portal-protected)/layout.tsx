"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRole } from "@/lib/useRole";
import {
  Home,
  Calendar,
  Clock,
  FileText,
  Target,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { href: "/portal", label: "Übersicht", icon: Home },
  { href: "/portal/zeiterfassung", label: "Zeiterfassung", icon: Clock },
  { href: "/portal/urlaub", label: "Urlaub", icon: Calendar },
  { href: "/portal/dokumente", label: "Dokumente", icon: FileText },
  { href: "/portal/ziele", label: "Ziele", icon: Target },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const { role, loading } = useRole();
  const [employee, setEmployee] = useState<{ first_name: string; last_name: string; position: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: emp } = await supabase
        .from("employees")
        .select("first_name, last_name, position")
        .eq("email", user.email)
        .maybeSingle();

      if (emp) {
        setEmployee(emp);
      }
    };

    if (!loading) {
      loadEmployee();
    }
  }, [loading, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/portal-login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
          <p className="mt-4 text-petrol-500">Laden…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={28} height={28} className="rounded" />
            <span className="font-bold text-petrol-900">iistelle</span>
            <span className="ml-1 rounded bg-coral-100 px-2 py-0.5 text-xs font-medium text-coral-700">Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-petrol-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-gray-100 bg-white px-4 py-3">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-petrol-700 hover:bg-gray-100"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-gray-100" />
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-5 w-5" />
                Abmelden
              </button>
            </div>
          </nav>
        )}
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-white shadow-lg lg:flex">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6">
            <Image src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded" />
            <div>
              <span className="font-bold text-petrol-900">iistelle</span>
              <span className="ml-2 rounded bg-coral-100 px-2 py-0.5 text-xs font-medium text-coral-700">Portal</span>
            </div>
          </div>

          {/* User Info */}
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-petrol-100 text-petrol-700">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-petrol-900 truncate">
                  {employee ? `${employee.first_name} ${employee.last_name}` : "Mitarbeiter"}
                </p>
                <p className="text-xs text-petrol-500 truncate">
                  {employee?.position || "Mitarbeiter-Portal"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-petrol-600 transition hover:bg-gray-100 hover:text-petrol-900"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 p-4">
            <div className="space-y-1">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut className="h-5 w-5" />
                Abmelden
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="mx-auto max-w-4xl p-4 pt-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}