-- ================================================
-- Test-User für Mitarbeiterportal mit Google-Account
-- Ausführen im Supabase Dashboard > SQL Editor
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
BEGIN
  -- Finde die User ID für den Google-Account
  SELECT id INTO v_user_id FROM auth.users WHERE email = 's.o.czachowski@googlemail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User nicht gefunden. Bitte zuerst über /portal-login anmelden.';
    RETURN;
  END IF;

  -- Finde eine existierende Company oder erstelle eine
  SELECT id INTO v_company_id FROM companies LIMIT 1;
  IF v_company_id IS NULL THEN
    INSERT INTO companies (name, created_at, updated_at)
    VALUES ('iistelle GmbH', NOW(), NOW())
    RETURNING id INTO v_company_id;
  END IF;

  -- Erstelle den Mitarbeiter (oder aktualisiere bestehenden)
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
    's.o.czachowski@googlemail.com',
    'Sebastian',
    'Oczachowski',
    'Gründer',
    'Geschäftsführung',
    CURRENT_DATE,
    'full_time',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = v_user_id,
    first_name = 'Sebastian',
    last_name = 'Oczachowski',
    position = 'Gründer',
    department = 'Geschäftsführung',
    updated_at = NOW();

  RAISE NOTICE 'Mitarbeiter verknüpft für: s.o.czachowski@googlemail.com';
END $$;
