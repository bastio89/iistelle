# iistelle

iistelle is a startup-grade SaaS platform for Swiss HR teams.

It is not an MVP, demo, prototype, or disposable experiment. The product is intended to continuously evolve into a reliable, compliant, secure, scalable, and polished HR platform for Swiss companies.

## Product Vision

The product vision and strategic roadmap are maintained in [ROADMAP.md](ROADMAP.md). The current application is located in [iistelle/](iistelle/), which also contains app-specific documentation and setup details.

## Development Philosophy

iistelle development should prioritize:

- production-quality foundations
- maintainable architecture
- Swiss HR and compliance awareness
- trustworthy user experience
- extensibility for future roadmap phases
- clear documentation of trade-offs
- security, privacy, auditability, and authorization from the start

Shortcuts are allowed only when they are intentional, visible, and documented with the follow-up needed to make them production-grade.

## Repository Structure

```text
.
├── CLAUDE.md              # Durable guidance for Claude Code and future agent work
├── ROADMAP.md             # Product strategy and long-term roadmap
├── ARCHITECTURE.md        # Architecture principles for the SaaS product
├── docs/
│   └── QUALITY_BAR.md     # Feature and review checklist
└── iistelle/              # Next.js application and app-local documentation
```

Deployment/app configuration lives with the application in [iistelle/](iistelle/). Check [iistelle/vercel.json](iistelle/vercel.json) and [iistelle/package.json](iistelle/package.json) before changing build or deployment assumptions.

## Getting Started

Use the app-local instructions in [iistelle/README.md](iistelle/README.md). Do not invent root-level setup commands unless a root workspace/package configuration is added and verified.

## Quality Bar

Every meaningful change should be reviewed against [docs/QUALITY_BAR.md](docs/QUALITY_BAR.md), especially for:

- maintainability
- security and privacy
- HR-domain correctness
- Swiss compliance awareness
- SaaS evolution
- UX credibility for real HR teams
- alignment with [ROADMAP.md](ROADMAP.md)
