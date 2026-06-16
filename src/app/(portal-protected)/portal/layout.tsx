import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/portal-login");
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Simplified Portal Sidebar */}
      <aside className="w-64 border-r border-petrol-100 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-petrol-100 px-4">
          <a href="/portal" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-petrol-900">
              <span className="text-sm font-bold text-white">ii</span>
            </div>
            <span className="font-bold text-petrol-900">Portal</span>
          </a>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <a href="/portal" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-50">
                <span>🏠</span> Dashboard
              </a>
            </li>
            <li>
              <a href="/portal/zeiterfassung" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-50">
                <span>⏰</span> Zeiterfassung
              </a>
            </li>
            <li>
              <a href="/portal/urlaub" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-50">
                <span>📅</span> Urlaub
              </a>
            </li>
            <li>
              <a href="/portal/performance" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-50">
                <span>🎯</span> Ziele & Performance
              </a>
            </li>
            <li>
              <a href="/portal/dokumente" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-50">
                <span>📄</span> Dokumente
              </a>
            </li>
          </ul>

          <div className="mt-8 border-t border-petrol-100 pt-6">
            <p className="px-3 text-xs font-semibold uppercase text-petrol-400">Konto</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/portal/profil" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-petrol-700 hover:bg-petrol-50">
                  <span>👤</span> Mein Profil
                </a>
              </li>
              <li>
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                    <span>🚪</span> Abmelden
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Simple Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-petrol-100 bg-white px-6">
          <h2 className="text-lg font-semibold text-petrol-900">Mitarbeiter-Portal</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-petrol-500">{user?.email}</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}