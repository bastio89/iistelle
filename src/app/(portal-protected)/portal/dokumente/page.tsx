"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, HrDocument, DOC_CATEGORY_META } from "@/lib/types";
import { formatDate } from "@/components/ui";
import { formatBytes } from "@/lib/types";
import {
  FileText,
  Download,
  Search,
  FolderOpen,
  AlertCircle,
  File,
  FileCheck,
  FileSignature,
} from "lucide-react";

export default function PortalDokumentePage() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<HrDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (!emp) {
      setLoading(false);
      return;
    }

    const employee = emp as Employee;
    setEmployee(employee);

    const { data: docs } = await supabase
      .from("hr_documents")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setDocuments((docs as HrDocument[]) ?? []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-petrol-300" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Kein Mitarbeiterprofil</h2>
      </div>
    );
  }

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryIcons = {
    vertrag: FileSignature,
    zeugnis: FileCheck,
    bescheinigung: File,
    sonstige: FileText,
  };

  const categoryColors = {
    vertrag: "bg-violet-100 text-violet-600",
    zeugnis: "bg-emerald-100 text-emerald-600",
    bescheinigung: "bg-sky-100 text-sky-600",
    sonstige: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-petrol-900">Meine Dokumente</h1>
        <p className="mt-1 text-petrol-500">Deine persönlichen Dokumente und Verträge</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-petrol-400" />
        <input
          type="text"
          placeholder="Dokumente durchsuchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <FolderOpen className="mx-auto h-12 w-12 text-petrol-300" />
          <p className="mt-4 text-petrol-500">
            {search ? "Keine Dokumente gefunden." : "Noch keine Dokumente verfügbar."}
          </p>
          <p className="mt-2 text-sm text-petrol-400">
            Wende dich an HR, um Dokumente hinzuzufügen.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredDocs.map((doc) => {
            const Icon = categoryIcons[doc.category];
            const colorClass = categoryColors[doc.category];
            const meta = DOC_CATEGORY_META[doc.category];

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-petrol-900">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-petrol-500">
                      <span className={`rounded px-2 py-0.5 font-medium ${colorClass}`}>
                        {meta.label}
                      </span>
                      <span>{formatBytes(doc.size_bytes)}</span>
                      <span>·</span>
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`/api/download?path=${encodeURIComponent(doc.storage_path)}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-petrol-600 transition hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  Herunterladen
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}