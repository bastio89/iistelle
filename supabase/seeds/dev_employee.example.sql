-- ================================================
-- LOCAL-ONLY seed template for the employee portal
-- ================================================
-- This file is NOT a production migration. Do not place it in
-- supabase/migrations. Run it manually against a local/dev database only.
--
-- It uses placeholders so no real personal data ever enters the repository.
-- Replace the placeholder values before running locally.
-- ================================================

DO $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
  -- Replace with the email of a dev user you created via the local auth flow.
  v_email TEXT := 'dev.employee@example.test';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No auth user found for %, sign in via /portal-login first.', v_email;
    RETURN;
  END IF;

  SELECT id INTO v_company_id FROM companies LIMIT 1;
  IF v_company_id IS NULL THEN
    INSERT INTO companies (name, created_at, updated_at)
    VALUES ('Dev Test Company', NOW(), NOW())
    RETURNING id INTO v_company_id;
  END IF;

  INSERT INTO employees (
    company_id, user_id, email, first_name, last_name,
    position, department, hire_date, employment_type, status,
    created_at, updated_at
  ) VALUES (
    v_company_id, v_user_id, v_email, 'Dev', 'Employee',
    'Test Position', 'Test Department', CURRENT_DATE, 'full_time', 'active',
    NOW(), NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = v_user_id,
    updated_at = NOW();

  RAISE NOTICE 'Linked dev employee for %', v_email;
END $$;
