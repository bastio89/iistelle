"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie, Settings, Check } from "lucide-react";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch {
        // Invalid data, show banner again
        setShow(true);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences, acceptedAll: boolean = false) => {
    const consent = {
      preferences: prefs,
      acceptedAll,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShow(false);

    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }));
  };

  const handleAcceptAll = () => {
    saveConsent({ ...defaultPreferences, analytics: true, marketing: true }, true);
  };

  const handleRejectAll = () => {
    saveConsent(defaultPreferences, false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences, false);
  };

  const updatePreference = (key: keyof Omit<CookiePreferences, "necessary">, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-petrol-950/20"
        onClick={() => setShowDetails(false)}
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
      >
        <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-petrol-100">
            {!showDetails ? (
              // Simple view
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-petrol-100 text-petrol-600">
                  <Cookie className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 id="cookie-title" className="font-bold text-petrol-900">
                    🍪 Wir verwenden Cookies
                  </h2>
                  <p className="mt-1 text-sm text-petrol-600">
                    Wir nutzen Cookies, um deine Erfahrung zu verbessern. Mit dem Klick auf „Alle akzeptieren" stimmst du der Nutzung von Cookies zu.{" "}
                    <button
                      onClick={() => setShowDetails(true)}
                      className="font-semibold text-petrol-800 underline hover:text-coral-500"
                    >
                      Mehr erfahren
                    </button>
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:shrink-0">
                  <button
                    onClick={handleRejectAll}
                    className="rounded-lg border border-petrol-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-50"
                  >
                    Ablehnen
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral-600"
                  >
                    Alle akzeptieren
                  </button>
                </div>
              </div>
            ) : (
              // Detailed view
              <div className="flex flex-col">
                <div className="flex items-center justify-between border-b border-petrol-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Cookie className="h-5 w-5 text-petrol-600" />
                    <h2 className="font-bold text-petrol-900">Cookie-Einstellungen</h2>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="rounded-lg p-1 text-petrol-500 transition hover:bg-petrol-100 hover:text-petrol-700"
                    aria-label="Schließen"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <p className="text-sm text-petrol-600">
                    Hier kannst du die Cookies, die wir verwenden, individuell verwalten. Weitere Informationen findest du in unserer{" "}
                    <Link href="/datenschutz" className="font-semibold text-petrol-800 underline hover:text-coral-500">
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>

                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-4 rounded-xl bg-petrol-50 p-4">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-petrol-200">
                      <Check className="h-3 w-3 text-petrol-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-petrol-900">Notwendige Cookies</h3>
                        <span className="rounded-full bg-petrol-200 px-2 py-0.5 text-xs font-semibold text-petrol-700">
                          Immer aktiv
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-petrol-600">
                        Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. Sie werden in der Regel nur als Reaktion auf von dir getätigte Aktionen gesetzt.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-4 rounded-xl border border-petrol-100 p-4">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={preferences.analytics}
                      onChange={(e) => updatePreference("analytics", e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-petrol-300 text-coral-500 focus:ring-coral-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-petrol-900">Analyse-Cookies</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${preferences.analytics ? "bg-emerald-100 text-emerald-700" : "bg-petrol-100 text-petrol-500"}`}>
                          {preferences.analytics ? "Aktiviert" : "Deaktiviert"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-petrol-600">
                        Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-4 rounded-xl border border-petrol-100 p-4">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={preferences.marketing}
                      onChange={(e) => updatePreference("marketing", e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-petrol-300 text-coral-500 focus:ring-coral-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-petrol-900">Marketing-Cookies</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${preferences.marketing ? "bg-emerald-100 text-emerald-700" : "bg-petrol-100 text-petrol-500"}`}>
                          {preferences.marketing ? "Aktiviert" : "Deaktiviert"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-petrol-600">
                        Diese Cookies werden verwendet, um Besucher über Websites hinweg zu verfolgen und personalisierte Werbung anzuzeigen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-petrol-100 px-6 py-4 sm:flex-row sm:justify-end">
                  <button
                    onClick={handleRejectAll}
                    className="rounded-lg border border-petrol-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-50"
                  >
                    Nur notwendige akzeptieren
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="rounded-lg bg-petrol-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-petrol-900"
                  >
                    Alle akzeptieren
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral-600"
                  >
                    Auswahl speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Hook um Cookie-Präferenzen abzufragen
export function useCookieConsent() {
  const [consent, setConsent] = useState<{
    preferences: CookiePreferences;
    acceptedAll: boolean;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (saved) {
      try {
        setConsent(JSON.parse(saved));
      } catch {
        // Invalid data
      }
    }

    const handleUpdate = (event: Event) => {
      setConsent((event as CustomEvent).detail);
    };

    window.addEventListener("cookie-consent-updated", handleUpdate);
    return () => window.removeEventListener("cookie-consent-updated", handleUpdate);
  }, []);

  return {
    hasConsented: !!consent,
    preferences: consent?.preferences || defaultPreferences,
    acceptedAll: consent?.acceptedAll || false,
  };
}

// Small banner that can be shown again for preferences
export function CookieSettingsButton() {
  const [show, setShow] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved).preferences);
      } catch {
        // Invalid data
      }
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-2 text-sm text-petrol-500 underline transition hover:text-petrol-700"
      >
        <Settings className="h-4 w-4" />
        Cookie-Einstellungen
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-petrol-950/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShow(false)}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-petrol-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <Cookie className="h-5 w-5 text-petrol-600" />
                <h2 className="font-bold text-petrol-900">Cookie-Einstellungen</h2>
              </div>
              <button
                onClick={() => setShow(false)}
                className="rounded-lg p-1 text-petrol-500 transition hover:bg-petrol-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between rounded-xl bg-petrol-50 p-4">
                <div>
                  <h3 className="font-semibold text-petrol-900">Notwendige Cookies</h3>
                  <p className="text-sm text-petrol-600">Immer aktiv</p>
                </div>
                <Check className="h-5 w-5 text-emerald-500" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-petrol-100 p-4">
                <div>
                  <h3 className="font-semibold text-petrol-900">Analyse-Cookies</h3>
                  <p className="text-sm text-petrol-600">Anonyme Nutzungsstatistiken</p>
                </div>
                <button
                  onClick={() => {
                    const newPrefs = { ...preferences, analytics: !preferences.analytics };
                    setPreferences(newPrefs);
                    localStorage.setItem("cookie-consent", JSON.stringify({
                      preferences: newPrefs,
                      acceptedAll: false,
                      timestamp: new Date().toISOString(),
                    }));
                  }}
                  className={`relative h-6 w-11 rounded-full transition-colors ${preferences.analytics ? "bg-coral-500" : "bg-petrol-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${preferences.analytics ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-petrol-100 p-4">
                <div>
                  <h3 className="font-semibold text-petrol-900">Marketing-Cookies</h3>
                  <p className="text-sm text-petrol-600">Personalisierte Werbung</p>
                </div>
                <button
                  onClick={() => {
                    const newPrefs = { ...preferences, marketing: !preferences.marketing };
                    setPreferences(newPrefs);
                    localStorage.setItem("cookie-consent", JSON.stringify({
                      preferences: newPrefs,
                      acceptedAll: false,
                      timestamp: new Date().toISOString(),
                    }));
                  }}
                  className={`relative h-6 w-11 rounded-full transition-colors ${preferences.marketing ? "bg-coral-500" : "bg-petrol-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${preferences.marketing ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>

            <div className="border-t border-petrol-100 px-6 py-4">
              <button
                onClick={() => setShow(false)}
                className="w-full rounded-lg bg-petrol-800 py-2 text-sm font-semibold text-white transition hover:bg-petrol-900"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}