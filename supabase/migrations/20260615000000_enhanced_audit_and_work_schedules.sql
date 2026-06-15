-- ============================================================
-- Migration: Erweiterte Audit-Log-Tabelle für DSGVO-Compliance
-- Stand: Juni 2026
-- ============================================================

-- Neue Spalten zur audit_logs Tabelle hinzufügen
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_email TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS object_type TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS object_id TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS old_value TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_value TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Kanton für firmenspezifische Feiertagsberechnung
ALTER TABLE companies ADD COLUMN IF NOT EXISTS canton TEXT DEFAULT 'ZH';

-- Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_object ON audit_logs(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Neue Tabelle für Work Schedules (Arbeitszeiten)
CREATE TABLE IF NOT EXISTS work_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TEXT NOT NULL DEFAULT '09:00',
  end_time TEXT NOT NULL DEFAULT '18:00',
  break_minutes INTEGER NOT NULL DEFAULT 60,
  is_working_day BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(employee_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_work_schedules_employee ON work_schedules(employee_id);

-- Neue Tabelle für Überstunden-Einträge
CREATE TABLE IF NOT EXISTS overtime_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours DECIMAL(4,2) NOT NULL CHECK (hours > 0),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offen' CHECK (status IN ('offen', 'genehmigt', 'abgelehnt')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_overtime_employee ON overtime_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_date ON overtime_entries(date);

-- Neue Tabelle für Kanton-spezifische Feiertage (optional - für spätere Nutzung)
CREATE TABLE IF NOT EXISTS custom_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  canton TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custom_holidays_company ON custom_holidays(company_id);

-- Neue Tabelle für Einwilligungen (DSGVO)
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consents_user ON consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_type ON consents(consent_type);

-- Trigger für automatische updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_work_schedules_updated_at
  BEFORE UPDATE ON work_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_overtime_entries_updated_at
  BEFORE UPDATE ON overtime_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies für Audit-Logs (nur Admins können alle sehen)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies für Work Schedules
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can view work schedules" ON work_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can view their own work schedules" ON work_schedules
  FOR SELECT USING (employee_id IN (SELECT id FROM employees WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can manage work schedules" ON work_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policies für Overtime Entries
ALTER TABLE overtime_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all overtime entries" ON overtime_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Managers can view team overtime" ON overtime_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'
    )
  );

CREATE POLICY "Users can view own overtime" ON overtime_entries
  FOR SELECT USING (employee_id IN (SELECT id FROM employees WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins and managers can manage overtime" ON overtime_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  );

-- RLS Policies für Consents
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consents" ON consents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert consents" ON consents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

COMMENT ON TABLE audit_logs IS 'Vollständiges Audit-Trail für alle sicherheitsrelevanten Aktionen (DSGVO-Compliance)';
COMMENT ON TABLE work_schedules IS 'Individuelle Arbeitszeiten pro Mitarbeiter und Wochentag';
COMMENT ON TABLE overtime_entries IS 'Erfasste Überstunden mit Genehmigungs-Workflow';
COMMENT ON TABLE custom_holidays IS 'Firmenspezifische Feiertage (zusätzlich zu kantonalen Feiertagen)';
COMMENT ON TABLE consents IS 'Dokumentation aller Einwilligungen gemäß DSGVO Art. 7';