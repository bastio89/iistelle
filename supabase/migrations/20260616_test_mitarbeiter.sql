-- ================================================
-- Test-User für Mitarbeiterportal erstellen
-- Ausführen im Supabase Dashboard > SQL Editor
-- ================================================

-- 1. Auth User für Test-Mitarbeiter erstellen
-- Dieser User kann sich dann über /portal-login anmelden

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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'mitarbeiter@test.de',
  '{}',
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  FALSE,
  '{"first_name": "Max", "last_name": "Mustermann"}',
  '{"provider": "email"}'
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- 2. Mitarbeiter-Datensatz erstellen und mit User verknüpfen
-- Annahme: Die obige Query gibt eine ID zurück
-- Du musst die ID aus Schritt 1 hier einsetzen:

-- OPTION A: Wenn du die ID manuell einfügen willst
-- Ersetze 'USER_ID_HIER_EINFÜGEN' mit der tatsächlichen User-ID

-- OPTION B: Automatisch - führe diese Zeilen nach dem INSERT aus

DO $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
BEGIN
  -- Finde die User ID
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'mitarbeiter@test.de';

  -- Finde eine existierende Company oder erstelle eine
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  IF v_company_id IS NULL THEN
    INSERT INTO companies (name, created_at, updated_at)
    VALUES ('Test GmbH', NOW(), NOW())
    RETURNING id INTO v_company_id;
  END IF;

  -- Erstelle den Mitarbeiter
  INSERT INTO employees (
    company_id,
    user_id,
    email,
    first_name,
    last_name,
    position,
    department,
    hire_date,
    employment_type,
    status,
    created_at,
    updated_at
  ) VALUES (
    v_company_id,
    v_user_id,
    'mitarbeiter@test.de',
    'Max',
    'Mustermann',
    'Softwareentwickler',
    'IT',
    CURRENT_DATE,
    'full_time',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = v_user_id,
    first_name = 'Max',
    last_name = 'Mustermann',
    updated_at = NOW();

  RAISE NOTICE 'Test-Mitarbeiter erstellt: mitarbeiter@test.de';
END $$;

-- 3. Passwort für den Test-User setzen (via Supabase Dashboard)
-- Gehe zu: Authentication > Users > mitarbeiter@test.de > Reset password

-- ================================================
-- Anmeldedaten für das Mitarbeiterportal:
-- ================================================
-- E-Mail:    mitarbeiter@test.de
-- Passwort:   (bitte im Dashboard setzen)
-- Login-URL:  http://localhost:3000/portal-login
-- ================================================
