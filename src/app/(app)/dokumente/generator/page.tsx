"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, DOC_CATEGORY_META, DocCategory } from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { Avatar, Modal, PageHeader, formatDate } from "@/components/ui";
import {
  FileText,
  Download,
  Plus,
  Users,
  ChevronRight,
  Loader2,
  Eye,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type DocType = "arbeitsvertrag" | "zeugnis" | "arbeitsbescheinigung" | "lohnbescheinigung";
type Tab = "generator" | "vorschau" | "historie";

const DOC_TYPE_META: Record<
  DocType,
  { label: string; description: string; icon: React.ElementType; category: DocCategory }
> = {
  arbeitsvertrag: {
    label: "Arbeitsvertrag",
    description: "Vollständiger Arbeitsvertrag mit allen Standardklauseln",
    icon: Briefcase,
    category: "vertrag",
  },
  zeugnis: {
    label: "Arbeitszeugnis",
    description: "Qualifiziertes Arbeitszeugnis mit Bewertungen",
    icon: FileText,
    category: "zeugnis",
  },
  arbeitsbescheinigung: {
    label: "Arbeitsbescheinigung",
    description: "Bestätigung der Anstellung für Behörden",
    icon: CheckCircle2,
    category: "bescheinigung",
  },
  lohnbescheinigung: {
    label: "Lohnabrechnungsbescheinigung",
    description: "Übersicht der Lohnzahlungen für Steuererklärung",
    icon: FileText,
    category: "bescheinigung",
  },
};

export default function DocumentGeneratorPage() {
  const supabase = createClient();
  const { isAdmin } = useRole();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [docType, setDocType] = useState<DocType>("arbeitsvertrag");
  const [tab, setTab] = useState<Tab>("generator");
  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [showEmployeeSelect, setShowEmployeeSelect] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<
    { name: string; category: string; created_at: string; employee_name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("employees")
        .select("*")
        .order("last_name");
      setEmployees((data as Employee[]) ?? []);

      // Load existing documents
      const { data: docs } = await supabase
        .from("documents")
        .select("name, category, created_at, employee:employees(first_name, last_name)")
        .order("created_at", { ascending: false })
        .limit(50);
      setGeneratedDocs(
        (docs ?? []).map((d: any) => ({
          name: d.name,
          category: d.category,
          created_at: d.created_at,
          employee_name: d.employee
            ? `${d.employee.first_name} ${d.employee.last_name}`
            : "Unbekannt",
        }))
      );
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function generateDocument() {
    if (!selectedEmployee) return;
    setGenerating(true);

    // Simulate document generation (in production, this would call a PDF generation service)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock content based on document type
    const docContent = generateDocContent(selectedEmployee, docType);
    setGeneratedDoc(docContent);
    setGenerating(false);
    setTab("vorschau");
  }

  async function downloadDocument() {
    if (!selectedEmployee || !generatedDoc) return;

    // In production, this would generate and download a real PDF
    // For now, create a text file download
    const blob = new Blob([generatedDoc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${DOC_TYPE_META[docType].label.replace(/\s+/g, "_")}_${selectedEmployee.last_name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Save to documents table
    const path = `${selectedEmployee.id}/${Date.now()}_${docType}.txt`;
    await supabase.storage.from("dokumente").upload(path, blob);
    await supabase.from("documents").insert({
      employee_id: selectedEmployee.id,
      name: `${DOC_TYPE_META[docType].label} - ${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      category: DOC_TYPE_META[docType].category,
      storage_path: path,
      size_bytes: blob.size,
    });
  }

  if (!isAdmin) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Keine Berechtigung</h2>
        <p className="mt-2 text-petrol-500">
          Nur Administratoren können Dokumente generieren.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Laden…</p>;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "generator", label: "Generator" },
    { key: "vorschau", label: "Vorschau" },
    { key: "historie", label: "Historie" },
  ];

  return (
    <div>
      <PageHeader
        title="Dokumenten-Generator"
        subtitle="Erstelle professionelle Dokumente für deine Mitarbeiter:innen."
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-petrol-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "text-petrol-900 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-coral-500"
                : "text-petrol-400 hover:text-petrol-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "generator" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Step 1: Select Employee */}
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-petrol-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                1
              </span>
              Mitarbeiter:in auswählen
            </h3>
            {selectedEmployee ? (
              <div className="flex items-center justify-between rounded-lg border border-petrol-200 bg-petrol-50 p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                    size="sm"
                  />
                  <div>
                    <p className="font-semibold text-petrol-900">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </p>
                    <p className="text-sm text-petrol-500">
                      {selectedEmployee.position} · seit {formatDate(selectedEmployee.hire_date)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmployeeSelect(true)}
                  className="text-sm font-semibold text-coral-500 hover:text-coral-600"
                >
                  Ändern
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEmployeeSelect(true)}
                className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-petrol-200 p-4 text-left transition hover:border-coral-300 hover:bg-coral-50/30"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-petrol-400" />
                  <div>
                    <p className="font-semibold text-petrol-700">Mitarbeiter:in wählen</p>
                    <p className="text-sm text-petrol-400">
                      Klicke, um einen Mitarbeiter auszuwählen
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-petrol-300" />
              </button>
            )}
          </div>

          {/* Step 2: Select Document Type */}
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-petrol-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                2
              </span>
              Dokumententyp wählen
            </h3>
            <div className="space-y-3">
              {(Object.keys(DOC_TYPE_META) as DocType[]).map((type) => {
                const meta = DOC_TYPE_META[type];
                const Icon = meta.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setDocType(type)}
                    className={`flex w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition ${
                      docType === type
                        ? "border-coral-500 bg-coral-50"
                        : "border-petrol-100 hover:border-petrol-200"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        docType === type ? "bg-coral-100 text-coral-600" : "bg-petrol-50 text-petrol-500"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          docType === type ? "text-coral-700" : "text-petrol-800"
                        }`}
                      >
                        {meta.label}
                      </p>
                      <p className="mt-0.5 text-sm text-petrol-500">{meta.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Generate */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-petrol-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white">
                3
              </span>
              Dokument generieren
            </h3>
            <button
              onClick={generateDocument}
              disabled={!selectedEmployee || generating}
              className="btn-primary flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird generiert…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Dokument generieren
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {tab === "vorschau" && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-petrol-900">
                {generatedDoc ? DOC_TYPE_META[docType].label : "Kein Dokument generiert"}
              </h3>
              {generatedDoc && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setTab("generator")}
                    className="btn-secondary"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Zurück
                  </button>
                  <button onClick={downloadDocument} className="btn-primary">
                    <Download className="h-4 w-4" />
                    Herunterladen
                  </button>
                </div>
              )}
            </div>

            {generatedDoc ? (
              <div className="rounded-lg border border-petrol-200 bg-white p-8 font-mono text-sm">
                <pre className="whitespace-pre-wrap">{generatedDoc}</pre>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-petrol-200 p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-petrol-300" />
                <p className="mt-4 text-petrol-500">
                  Noch kein Dokument generiert.
                </p>
                <button
                  onClick={() => setTab("generator")}
                  className="btn-primary mt-4"
                >
                  Dokument erstellen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "historie" && (
        <div className="card overflow-hidden">
          <div className="border-b border-petrol-100 bg-petrol-50/50 px-6 py-4">
            <h3 className="font-bold text-petrol-900">Zuletzt generierte Dokumente</h3>
          </div>
          {generatedDocs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-petrol-300" />
              <p className="mt-4 text-petrol-500">Noch keine Dokumente generiert.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                  <th className="px-6 py-3">Dokument</th>
                  <th className="px-6 py-3">Mitarbeiter:in</th>
                  <th className="px-6 py-3">Typ</th>
                  <th className="px-6 py-3">Erstellt am</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-petrol-50">
                {generatedDocs.map((doc, idx) => {
                  const categoryMeta = DOC_CATEGORY_META[doc.category as DocCategory];
                  return (
                    <tr key={idx} className="hover:bg-petrol-50/50">
                      <td className="px-6 py-4 font-medium text-petrol-900">{doc.name}</td>
                      <td className="px-6 py-4 text-petrol-600">{doc.employee_name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryMeta?.color || "bg-slate-100 text-slate-700"}`}
                        >
                          {categoryMeta?.label || doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-petrol-500">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="rounded-lg p-2 text-petrol-400 transition hover:bg-petrol-100 hover:text-petrol-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Employee Selection Modal */}
      {showEmployeeSelect && (
        <Modal
          title="Mitarbeiter:in auswählen"
          onClose={() => setShowEmployeeSelect(false)}
        >
          <div className="max-h-96 overflow-y-auto space-y-2">
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => {
                  setSelectedEmployee(emp);
                  setShowEmployeeSelect(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-petrol-50"
              >
                <Avatar
                  name={`${emp.first_name} ${emp.last_name}`}
                  size="sm"
                />
                <div>
                  <p className="font-semibold text-petrol-900">
                    {emp.first_name} {emp.last_name}
                  </p>
                  <p className="text-sm text-petrol-500">
                    {emp.position} · {emp.department}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function generateDocContent(employee: Employee, docType: DocType): string {
  const today = new Date().toLocaleDateString("de-CH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  switch (docType) {
    case "arbeitsvertrag":
      return `ARBEITSVERTRAG

zwischen

Arbeitgeber: [Firmenname]
[in Ihrer Firma hinterlegt]

und

Arbeitnehmer/in: ${employee.first_name} ${employee.last_name}
Geburtsdatum: ${employee.birth_date || "[nicht angegeben]"}
E-Mail: ${employee.email}

§ 1 Arbeitsverhältnis
Das Arbeitsverhältnis beginnt am ${formatDate(employee.hire_date)}.

§ 2 Arbeitsort
Der Arbeitsort befindet sich in ${employee.location || "[Arbeitsort]"}.

§ 3 Position und Aufgaben
Die Arbeitnehmerin/Der Arbeitnehmer wird als ${employee.position} in der Abteilung ${employee.department} tätig.

§ 4 Arbeitszeit
Die Arbeitszeit beträgt gemäß ${employee.employment_type}.

§ 5 Lohn
Der monatliche Bruttolohn beträgt [CHF Betrag] und wird jeweils am Ende des Monats ausbezahlt.

§ 6 Ferien
Die/der Arbeitnehmer/in hat Anspruch auf ${employee.vacation_days_per_year} Werktage Ferien pro Kalenderjahr.

§ 7 Probezeit
Die Probezeit beträgt 3 Monate.

§ 8 Kündigung
Das Arbeitsverhältnis kann von beiden Seiten mit einer Kündigungsfrist von einem Monat schriftlich auf Ende eines Monats gekündigt werden.

§ 9 Schlussbestimmungen
Dieser Vertrag untersteht dem schweizerischen Obligationenrecht (OR).

Ausgestellt am: ${today}

_________________________
Arbeitgeber

_________________________
${employee.first_name} ${employee.last_name}
Arbeitnehmer/in`;

    case "zeugnis":
      return `ARBEITSZEUGNIS

Hiermit wird bestätigt, dass

Frau/Herr ${employee.first_name} ${employee.last_name}
geb. am ${employee.birth_date || "[nicht angegeben]"}
vom ${formatDate(employee.hire_date)} bis ${employee.exit_date ? formatDate(employee.exit_date) : "heute"} als

${employee.position}
in der Abteilung ${employee.department}

für uns tätig war/war.

Die/Der Mitarbeiter/in wurde am ${formatDate(employee.hire_date)} eingestellt und hat sich während ihrer/seiner Tätigkeit stets zu unserer vollen Zufriedenheit ausgezeichnet.

Sie/Er zeichnete sich durch folgende Eigenschaften aus:
- Zuverlässigkeit und Pünktlichkeit
- Selbstständige und gewissenhafte Arbeitsweise
- Gute teamwork-Fähigkeiten
- Hohe Fachkompetenz

${employee.skills.length > 0 ? `Besondere Kenntnisse: ${employee.skills.join(", ")}.` : ""}

Die/Der Mitarbeiter/in verlässt unser Unternehmen auf eigenen Wunsch / im guten Einvernehmen.

Wir danken ihr/ihm für die gute Zusammenarbeit und wünschen für die private und berufliche Zukunft alles Gute.

Ausgestellt am: ${today}

_________________________
[Firmenname]`;

    case "arbeitsbescheinigung":
      return `ARBEITSBESCHEINIGUNG

Hiermit wird bestätigt, dass

Frau/Herr: ${employee.first_name} ${employee.last_name}
Geburtsdatum: ${employee.birth_date || "[nicht angegeben]"}
AHV-Nummer: [AHV-Nummer]

vom ${formatDate(employee.hire_date)} bis ${employee.exit_date ? formatDate(employee.exit_date) : "heute"} als

${employee.position}
in der Abteilung ${employee.department}
mit einem Beschäftigungsgrad von 100% (Vollzeit) / [XX]% (Teilzeit)

bei uns angestellt war/ist.

Diese Bescheinigung wird auf Wunsch der/des Angestellten für folgende Zwecke ausgestellt:
☐ Behörden
☐ Bank
☐ Versicherung
☐ Sonstiges: _______________

Ausgestellt am: ${today}

_________________________
[Firmenname]
HR-Abteilung`;

    case "lohnbescheinigung":
      return `LOHNABRECHNUNGSBESCHEINIGUNG ${new Date().getFullYear()}

Mitarbeiter/in: ${employee.first_name} ${employee.last_name}
AHV-Nummer: [AHV-Nummer]
Personalnummer: [Personalnummer]

Position: ${employee.position}
Abteilung: ${employee.department}
Anstellungsdatum: ${formatDate(employee.hire_date)}

JAHRESLOHNÜBERSICHT ${new Date().getFullYear()}

Monat        Bruttolohn    NBU        Netto
─────────────────────────────────────────────
Januar       [CHF]         [CHF]      [CHF]
Februar      [CHF]         [CHF]      [CHF]
März         [CHF]         [CHF]      [CHF]
April        [CHF]         [CHF]      [CHF]
Mai          [CHF]         [CHF]      [CHF]
Juni         [CHF]         [CHF]      [CHF]
Juli         [CHF]         [CHF]      [CHF]
August       [CHF]         [CHF]      [CHF]
September    [CHF]         [CHF]      [CHF]
Oktober      [CHF]         [CHF]      [CHF]
November     [CHF]         [CHF]      [CHF]
Dezember     [CHF]         [CHF]      [CHF]
─────────────────────────────────────────────
TOTAL        [CHF]         [CHF]      [CHF]

Ferien- / Feiertagguthaben:
Jahresanspruch: ${employee.vacation_days_per_year} Tage
Bezogen: [Tage]

Ausgestellt am: ${today}

_________________________
[Firmenname]
Lohnbuchhaltung`;

    default:
      return "Dokument konnte nicht generiert werden.";
  }
}