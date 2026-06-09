"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmailTemplate, TEMPLATE_TYPE_META, TemplateType } from "@/lib/types";
import { EmptyState, Modal, PageHeader } from "@/components/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function TemplatesPage() {
  const supabase = createClient();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("email_templates")
      .select("*")
      .order("created_at");
    setTemplates((data as EmailTemplate[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Vorlage wirklich löschen?")) return;
    await supabase.from("email_templates").delete().eq("id", id);
    load();
  }

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Vorlagen…</p>;
  }

  return (
    <div>
      <PageHeader
        title="E-Mail-Vorlagen"
        subtitle="Vorlagen mit Platzhaltern: {{vorname}}, {{nachname}}, {{stelle}}, {{firma}}, {{absender}}"
        action={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Neue Vorlage
          </button>
        }
      />

      {templates.length === 0 ? (
        <EmptyState
          title="Keine Vorlagen vorhanden"
          hint="Lege Vorlagen für Einladungen, Zu- und Absagen an."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((t) => {
            const meta = TEMPLATE_TYPE_META[t.template_type];
            return (
              <div key={t.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-petrol-900">{t.name}</h3>
                    <p className="mt-0.5 text-sm text-petrol-500">{t.subject}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-line text-sm text-petrol-600">
                  {t.body}
                </p>
                <div className="mt-4 flex justify-end gap-2 border-t border-petrol-50 pt-3">
                  <button
                    className="flex items-center gap-1 text-sm font-semibold text-petrol-600 hover:text-petrol-800"
                    onClick={() => setEditTemplate(t)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Bearbeiten
                  </button>
                  <button
                    className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600"
                    onClick={() => remove(t.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Löschen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showForm || editTemplate) && (
        <TemplateFormModal
          template={editTemplate}
          onClose={() => {
            setShowForm(false);
            setEditTemplate(null);
          }}
          onSaved={load}
        />
      )}
    </div>
  );
}

function TemplateFormModal({
  template,
  onClose,
  onSaved,
}: {
  template?: EmailTemplate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: template?.name ?? "",
    template_type: (template?.template_type ?? "sonstige") as TemplateType,
    subject: template?.subject ?? "",
    body: template?.body ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = template
      ? await supabase.from("email_templates").update(form).eq("id", template.id)
      : await supabase.from("email_templates").insert(form);
    if (!res.error) {
      onSaved();
      onClose();
    }
    setSaving(false);
  }

  return (
    <Modal
      title={template ? "Vorlage bearbeiten" : "Neue Vorlage"}
      onClose={onClose}
      wide
    >
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Typ</label>
            <select
              className="input"
              value={form.template_type}
              onChange={(e) =>
                setForm({ ...form, template_type: e.target.value as TemplateType })
              }
            >
              {Object.entries(TEMPLATE_TYPE_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Betreff *</label>
          <input
            className="input"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Text *</label>
          <textarea
            className="input min-h-48 font-mono text-xs"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
          />
          <p className="mt-1 text-xs text-petrol-400">
            Platzhalter: {"{{vorname}}, {{nachname}}, {{stelle}}, {{firma}}, {{absender}}"}
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" disabled={saving}>
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
