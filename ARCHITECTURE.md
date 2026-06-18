# Architecture Principles

## Product Posture

iistelle is a startup-grade, continuously evolving SaaS product for Swiss HR teams. Architecture decisions should support a long-lived product with growing requirements around HR workflows, employee self-service, compliance, integrations, analytics, mobile usage, and enterprise readiness.

Do not treat architecture as MVP scaffolding. Temporary simplifications are acceptable only when they are explicit, documented, and do not silently block the roadmap.

## Core Architectural Principles

### 1. Durable Domain Model

Model HR concepts explicitly instead of scattering ad-hoc shapes throughout the application.

Important domain concepts include:

- company
- employee
- department
- employment
- absence
- time entry
- candidate
- job
- document
- review
- workflow
- audit event
- subscription / plan

Business rules should live in clear, testable boundaries rather than being duplicated across UI components.

### 2. SaaS-Ready Boundaries

Design with future multi-tenancy and authorization in mind, even when a feature starts with a simpler path.

Prefer boundaries that make it clear:

- which company or tenant owns the data
- which user or employee can access it
- which role is required for each operation
- which actions should be auditable

### 3. Security and Privacy by Default

HR data is sensitive. Favor least privilege, explicit access checks, careful handling of personal data, and safe defaults.

Sensitive workflows should consider:

- server-side authorization
- protected route behavior
- audit logging
- data minimization
- secure file/document access
- secret handling
- safe integration boundaries

### 4. Compliance Awareness

Swiss data protection and GDPR-style expectations should influence product and technical design.

Consider compliance implications for:

- employee data export
- deletion and anonymization
- retention periods
- consent and processing records
- audit trails
- salary and document access
- cross-border integrations

### 5. Evolution Over Shortcuts

Avoid one-off implementations that make later roadmap phases harder. A feature should be able to evolve toward mobile usage, integrations, automation, analytics, and enterprise-readiness when relevant.

When a shortcut is chosen, document:

- why it is acceptable now
- what risk it creates
- what follow-up makes it production-grade

### 6. Testable and Observable

Business rules should be testable. Important workflows should expose clear states, errors, and logs.

Prefer implementations that make it easy to verify:

- happy paths
- empty states
- permission failures
- validation failures
- audit/compliance behavior
- integration failures

## Technical Decision Records

Significant architectural choices should be documented with:

```md
## Decision: <short title>

### Context

What problem or product need prompted this decision?

### Decision

What are we choosing?

### Alternatives Considered

What else was considered and why was it not selected?

### Consequences

What does this improve, and what trade-offs or follow-ups does it create?
```
