import Link from "next/link";
import Image from "next/image";
import { ServiceDropdown } from "./ServiceDropdown";

interface PublicNavProps {
  showLogin?: boolean;
  showCta?: string;
}

export function PublicNav({ showLogin = true, showCta = "Kostenlos starten" }: PublicNavProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-petrol-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="iistelle Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-petrol-900">
            iistelle
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-petrol-600 md:flex">
          <ServiceDropdown />
          <Link href="/ratgeber" className="link-hover transition-colors hover:text-petrol-900">
            Ratgeber
          </Link>
          <Link href="/preise" className="link-hover transition-colors hover:text-petrol-900">
            Preise
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {showLogin && (
            <>
              <Link
                href="/portal-login"
                className="flex items-center gap-2 rounded-lg border border-petrol-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-700 transition-all hover:border-petrol-300 hover:bg-petrol-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Portal-Login
              </Link>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-petrol-700 transition-all hover:bg-petrol-50"
              >
                Anmelden
              </Link>
            </>
          )}
          <Link href="/login" className="btn-primary">
            {showCta}
          </Link>
        </div>
      </div>
    </nav>
  );
}