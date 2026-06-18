# iistelle Quality Bar

## Default Standard

All implementation work should assume iistelle is a real startup-grade SaaS product for Swiss HR teams.

Do not lower the bar to MVP, demo, prototype, or disposable implementation quality unless the user explicitly asks for a temporary exploration. Even then, document what must change before production use.

## Feature Readiness Checklist

Before a feature is considered complete, review it against the following checklist.

### Product

- The feature aligns with [../ROADMAP.md](../ROADMAP.md).
- The behavior is credible for real HR teams and employees.
- Swiss HR context is considered where relevant, including cantons, holidays, multilingual expectations, and local compliance needs.
- Empty, loading, error, and permission states are considered.
- User-facing copy is professional and consistent.

### Engineering

- The implementation is maintainable and understandable.
- Business rules are explicit and testable.
- Domain concepts are modeled clearly instead of duplicated ad hoc.
- No unnecessary hardcoding or demo-only data exists in product paths.
- Important assumptions, limitations, and follow-ups are documented.
- Existing utilities and patterns are reused where appropriate.

### Security and Privacy

- Sensitive HR data is handled carefully.
- Access control implications are considered.
- Server-side validation/authorization is used for sensitive operations.
- Audit and compliance needs are considered where relevant.
- Secrets, personal data, and demo credentials are not exposed in logs, docs, or tests.

### SaaS Evolution

- The feature does not block future multi-tenancy.
- The feature can evolve toward mobile, integrations, automation, analytics, or enterprise workflows if relevant.
- Configuration and product assumptions are explicit.
- Shortcuts are documented as product or technical debt, not hidden in the implementation.

## Allowed, But Documented

These are acceptable only when intentional and documented:

- temporary simplifications
- deferred tests
- single-tenant assumptions
- mocked external integrations
- incomplete compliance workflows
- placeholder UI sections
- limited observability

For each case, document:

1. why the simplification is acceptable now
2. what risk it creates
3. what must happen before the feature is considered production-grade

## Review Questions

Use these questions during reviews:

- Would this still make sense when iistelle has many companies and more complex roles?
- Would an HR team trust this behavior with real employee data?
- Are privacy, auditability, and compliance considered enough for the sensitivity of the data?
- Does this make future roadmap phases easier or harder?
- Is the implementation clear enough for another contributor to maintain?
