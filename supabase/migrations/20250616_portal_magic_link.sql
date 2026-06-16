-- ================================================
-- Portal-Optimierung: Magic-Link Flow
-- ================================================

-- 1. user_id zur employees-Tabelle hinzufügen (für Portal-Zuordnung)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Index für schnelle User-Suche
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);

-- 2. Employee Profiles Tabelle (Onboarding-Status)
CREATE TABLE IF NOT EXISTS employee_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Setup Tokens Tabelle für Magic-Link
CREATE TABLE IF NOT EXISTS employee_setup_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Token-Suche
CREATE INDEX IF NOT EXISTS idx_employee_setup_tokens_token ON employee_setup_tokens(token);
CREATE INDEX IF NOT EXISTS idx_employee_setup_tokens_expires ON employee_setup_tokens(expires_at);

-- 4. Trigger für auto-cleanup abgelaufener Tokens
CREATE OR REPLACE FUNCTION cleanup_expired_setup_tokens()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM employee_setup_tokens
  WHERE expires_at < NOW() - INTERVAL '30 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- RLS (Row Level Security) Policies
-- ================================================

-- Employees: Nur eigene Daten sehen
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Employees can view own data" ON employees
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON employee_profiles
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE employee_setup_tokens ENABLE ROW LEVEL SECURITY;
-- Setup Tokens nur für Admins sichtbar
CREATE POLICY "Admins can manage setup tokens" ON employee_setup_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ================================================
-- Helper Functions
-- =============================================

-- Token generieren
CREATE OR REPLACE FUNCTION generate_employee_setup_token(p_employee_id UUID, p_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Alte ungenutzte Tokens löschen
  DELETE FROM employee_setup_tokens
  WHERE employee_id = p_employee_id AND used_at IS NULL;

  -- Token erstellen (kryptographisch sicher)
  v_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO employee_setup_tokens (employee_id, email, token)
  VALUES (p_employee_id, p_email, v_token);

  RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Token verifizieren
CREATE OR REPLACE FUNCTION verify_setup_token(p_token TEXT)
RETURNS JSONB AS $$
DECLARE
  v_token_data employee_setup_tokens%ROWTYPE;
  v_employee employees%ROWTYPE;
BEGIN
  SELECT * INTO v_token_data
  FROM employee_setup_tokens
  WHERE token = p_token AND used_at IS NULL AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Token ungültig oder abgelaufen');
  END IF;

  SELECT * INTO v_employee
  FROM employees
  WHERE id = v_token_data.employee_id;

  RETURN jsonb_build_object(
    'valid', true,
    'employee_id', v_token_data.employee_id,
    'email', v_token_data.email,
    'first_name', v_employee.first_name,
    'last_name', v_employee.last_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Setup abschließen
CREATE OR REPLACE FUNCTION complete_employee_setup(p_token TEXT, p_password TEXT)
RETURNS JSONB AS $$
DECLARE
  v_token_data employee_setup_tokens%ROWTYPE;
  v_user_id UUID;
BEGIN
  -- Token verifizieren
  SELECT * INTO v_token_data
  FROM employee_setup_tokens
  WHERE token = p_token AND used_at IS NULL AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token ungültig');
  END IF;

  -- Neuen Auth User erstellen
  INSERT INTO auth.users (
    instance_id,
    email,
    encrypted_data,
    created_at,
    updated_at,
    aud,
    role,
    is_super_admin,
    raw_user_meta_data,
    raw_app_meta_data
  )
  SELECT
    (SELECT id FROM auth.instances WHERE uuid = '00000000-0000-0000-0000-000000000000'),
    v_token_data.email,
    '{}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    FALSE,
    jsonb_build_object(
      'first_name', (SELECT first_name FROM employees WHERE id = v_token_data.employee_id),
      'last_name', (SELECT last_name FROM employees WHERE id = v_token_data.employee_id)
    ),
    jsonb_build_object('provider', 'email')
  RETURNING id INTO v_user_id;

  -- Passwort setzen (in Production mit proper hashing)
  -- Für Supabase: Passwort wird separat via API gesetzt

  -- Mitarbeiter mit User verknüpfen
  UPDATE employees SET user_id = v_user_id WHERE id = v_token_data.employee_id;

  -- Setup Token als verwendet markieren
  UPDATE employee_setup_tokens SET used_at = NOW() WHERE id = v_token_data.id;

  -- Employee Profile erstellen
  INSERT INTO employee_profiles (user_id, onboarding_completed)
  VALUES (v_user_id, FALSE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'user_id', v_user_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Onboarding abschließen
CREATE OR REPLACE FUNCTION complete_portal_onboarding(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE employee_profiles
  SET onboarding_completed = TRUE, completed_at = NOW(), updated_at = NOW()
  WHERE user_id = p_user_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;