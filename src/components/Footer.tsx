import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-petrol-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold tracking-tight text-petrol-900">
                iistelle
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-petrol-600">
              Recruiting + HR in einer Plattform. Made in Switzerland – für Unternehmen in der
              Schweiz und Deutschland.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-400">
              Produkt
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/preise" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/ratgeber" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Ratgeber
                </Link>
              </li>
              <li>
                <Link href="/karriere" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Karriere
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-petrol-400">
              Rechtliches
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/impressum" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-petrol-600 transition hover:text-petrol-900">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-petrol-100 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-xs text-petrol-400">
              © {new Date().getFullYear()} iistelle · twenty5ai
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-petrol-400">
            <span>Hosting in Frankfurt &bull; DSGVO-konform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}