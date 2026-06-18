# CLAUDE.md

## Product Identity

iistelle is a startup-grade, continuously evolving SaaS product for Swiss HR teams. Treat it as a serious long-lived product, not as an MVP, demo, prototype, or throwaway app.

The product should grow toward a reliable, compliant, secure, scalable, and polished HR platform for Swiss companies.

## Non-Negotiable Development Principles

- Treat every feature as part of a long-lived SaaS platform.
- Prefer production-ready architecture over one-off shortcuts.
- Avoid demo-only implementations, fake persistence, hardcoded company/employee/HR data, and temporary flows unless explicitly requested.
- When speed requires a shortcut, document the trade-off and the follow-up needed to make it production-grade.
- Consider privacy, security, auditability, authorization, and compliance implications early, especially because iistelle handles sensitive HR data.
- Keep Swiss HR requirements in mind by default: cantons, holidays, employment workflows, multilingual expectations, and DSG/GDPR-style data rights.
- Keep the codebase understandable for future contributors.

## Product Context

The canonical product direction is documented in [ROADMAP.md](ROADMAP.md). The application itself lives under [iistelle/](iistelle/); check app-local docs there before changing app behavior.

When implementing features, align with:

- Swiss HR market positioning
- SaaS-grade reliability and maintainability
- employee and manager self-service
- automation and workflow growth
- compliance, privacy, and security
- integrations and ecosystem readiness
- analytics and enterprise-readiness

## Implementation Expectations

For every meaningful implementation:

- Use clear domain boundaries and explicit business rules.
- Avoid overfitting to the first UI screen or first customer scenario.
- Add validation, empty states, loading states, permission states, and error handling where relevant.
- Prefer typed interfaces and reusable abstractions.
- Keep configuration explicit; do not hide product-critical assumptions in scattered constants.
- Add tests where practical, or document why tests are deferred.
- Keep user-facing copy professional, consistent, and credible for real HR teams.

## Review Checklist

Before considering a change complete, verify:

- Does this support long-term SaaS evolution?
- Are any MVP/demo/prototype shortcuts present? If yes, are they explicitly documented?
- Is the implementation maintainable and understandable?
- Are security, privacy, access control, and compliance implications considered?
- Is the user experience credible for a real HR product?
- Is the work aligned with [ROADMAP.md](ROADMAP.md) and app-local roadmap/docs?
- Are assumptions, limitations, and follow-ups documented?
