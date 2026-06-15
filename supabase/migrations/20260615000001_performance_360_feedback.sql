-- =====================================================
-- Phase 1: Performance Reviews erweitern (360° Feedback)
-- =====================================================

-- Review Cycles Tabelle für automatisierte Review-Zyklen
CREATE TABLE IF NOT EXISTS review_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                    -- z.B. "H1 2026"
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'aktiv',  -- aktiv, abgeschlossen, geplant
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Peer Feedback Anfragen (für 360° Feedback)
CREATE TABLE IF NOT EXISTS peer_feedback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES review_cycles(id) ON DELETE CASCADE,
  from_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  requested_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ausstehend',  -- ausstehend, eingereicht, abgelehnt
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Peer Feedback Einträge (die eigentlichen Feedbacks)
CREATE TABLE IF NOT EXISTS peer_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES peer_feedback_requests(id) ON DELETE CASCADE,
  from_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  strengths TEXT,
  improvements TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_review_cycles_company ON review_cycles(company_id);
CREATE INDEX IF NOT EXISTS idx_peer_feedback_requests_cycle ON peer_feedback_requests(cycle_id);
CREATE INDEX IF NOT EXISTS idx_peer_feedback_requests_to ON peer_feedback_requests(to_employee_id);
CREATE INDEX IF NOT EXISTS idx_peer_feedbacks_request ON peer_feedbacks(request_id);

-- RLS Policies
ALTER TABLE review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_feedback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_feedbacks ENABLE ROW LEVEL SECURITY;

-- Company-Member kann Review Cycles sehen
CREATE POLICY "company_members_view_review_cycles" ON review_cycles
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_roles WHERE user_id = auth.uid()
    )
  );

-- Admin kann Review Cycles verwalten
CREATE POLICY "admins_manage_review_cycles" ON review_cycles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND company_id = review_cycles.company_id
      AND role = 'admin'
    )
  );

-- Peer Feedback: Employee kann eigene Anfragen sehen
CREATE POLICY "employee_view_own_requests" ON peer_feedback_requests
  FOR SELECT USING (
    from_employee_id IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
    OR to_employee_id IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
    OR requested_by IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Admin kann Peer Feedback Requests verwalten
CREATE POLICY "admins_manage_peer_requests" ON peer_feedback_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Peer Feedback: Submitter kann eigene Feedbacks sehen
CREATE POLICY "submitter_view_own_feedback" ON peer_feedbacks
  FOR SELECT USING (
    from_employee_id IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Admin kann alle Peer Feedbacks sehen
CREATE POLICY "admins_view_all_feedback" ON peer_feedbacks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Anonymized Feedback für Employee (nur eigene Reviews)
CREATE POLICY "employee_view_own_received_feedback" ON peer_feedbacks
  FOR SELECT USING (
    to_employee_id IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Feedback erstellen
CREATE POLICY "employee_submit_feedback" ON peer_feedbacks
  FOR INSERT WITH CHECK (
    from_employee_id IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );