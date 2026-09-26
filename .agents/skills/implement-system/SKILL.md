---
name: implement-system
description: Implementation skill - triggered when coding, building, or implementing system designs. Writes REAL production code. Researches latest docs from the internet before using any framework or library. Supports full-stack implementation with user-chosen technologies. Uses milestone-based validation after each shippable slice.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Agent
---

# System Implementation Skill

You are implementing a system design. Write REAL, PRODUCTION-QUALITY code.
You MUST actually create files, run commands, install packages, and build working software.

## PRE-CONDITION: Read Project Context

**BEFORE writing any code:**

1. Read `projects/<active>/PROJECT.md` for:
   - **Complexity** (Simple / Medium / Complex) — controls how much infra/testing/docs
   - **User Skill** (Non-Programmer / Beginner / Intermediate / Professional) — controls how verbose and technical your explanations are
   - **Stack** section (Frontend, Backend, Database, Deploy OS, UI Library, Style)
2. If stack isn't populated (Non-Programmer / Beginner flow), pick safe defaults and
   state them before coding.
3. For Complex projects: also verify plan approval — see below.

## PRE-CONDITION: Completeness Artifacts (Rule 24 + Rule 25)

For any user-facing app, check these before generating code. If missing, STOP and
build them first — generating code for an incomplete spec just means more refactoring:

- **`design/PAGES.md`** — full page inventory. Run `/pages` if missing.
- **`design/RBAC.md`** — permission system (required if app has users). Run `/rbac` if missing.
- **`design/UX-KIT.md`** — state patterns, components, a11y rules. Run `/ux-kit` if missing.

These documents drive what gets scaffolded. Without them the output is a happy-path
skeleton that the user will bounce off.

## AUTO-SCAFFOLD LIST (from PAGES.md + RBAC.md + UX-KIT.md)

Every `/implement` run for a user-facing app generates ALL of these automatically:

### Auth (always)
Login, Register, Forgot Password, Reset Password, Email Verify, 2FA enroll +
challenge (if enabled), Invite Acceptance (if multi-user), OAuth callback handler.

### User Account
Profile, Settings (general, language, timezone), Security (2FA, sessions, devices),
Notification Preferences, Billing & Subscription (if paid), API Keys / Tokens (if API),
Connected Accounts (if OAuth), Danger Zone (delete account, export GDPR data).

### Admin Panel (if users)
Admin Dashboard (KPIs + charts), Users list (search/filter/invite/suspend/impersonate),
User Detail, Roles management, Permissions Matrix (role × permission grid), Audit Log
(searchable, exportable), System Settings, Feature Flags, Integration Settings.

### Main App
Dashboard (greeting + KPIs + charts + activity + quick actions), Notifications Center,
Global Search / Command Palette (Cmd-K), Help / Docs, Keyboard Shortcuts reference.

### Per-Entity (for each entity in schema)
List page with DataTable (search + sort + filter + pagination + bulk + export),
Detail page (info + related + activity + actions + comments), Create form (multi-step
if complex, auto-save draft, validation, preview), Edit form, Archive/Trash page.

### System Pages (always)
404, 403, 500, Maintenance, Rate Limited, Offline (PWA), Coming Soon (if applicable).

### Legal (always)
Terms of Service, Privacy Policy, Cookie Settings (GDPR granular consent).

### UX Kit Components (always)
Toast provider + `useToast()` hook, ConfirmDialog, EmptyState, LoadingSkeleton,
ErrorBoundary, ErrorState, Breadcrumbs, CommandPalette (cmdk/kbar), KeyboardShortcuts
modal, ThemeToggle, A11ySkipLink, DataTable (full-featured), BulkActionBar, FilterPanel,
FileUpload (drag-drop + progress + multi), FormWithAutosave, hooks (useToast, useConfirm,
useHotkeys, useDebounce, useDarkMode, useOnlineStatus, useReducedMotion, useOptimisticUpdate).

### RBAC Infrastructure (if users)
Prisma/Drizzle schema for User, Role, Permission, UserRole, RolePermission, ResourceACL,
AuditLog. Seed file with default roles (Super Admin, Tenant Admin, Manager, Editor,
Member, Viewer, Guest). Backend middleware/guard for `@Permissions('<resource>:<action>:<scope>')`.
Frontend `<Can>` component + `ProtectedRoute` wrapper + `usePermission()` hook.
Audit logger that writes before/after snapshots.

### Every Page Has
- Empty state (illustration + CTA)
- Loading skeleton (matches layout)
- Error state (retry + support link)
- Success feedback (toast / inline)
- Keyboard navigation
- Axe-core clean (no critical/serious violations)
- Dark mode + respects `prefers-reduced-motion`
- Responsive 320 / 768 / 1280 / 1920
- Permission check (hides buttons user can't use)

## Complexity-Driven Scope

| Complexity | Pages | UX Kit | RBAC | Auth |
|-----------|-------|--------|------|------|
| **Simple** | 8-15 essential pages | States + toast + confirm | 2-3 roles + decorators | login/register/forgot |
| **Medium** | 20-35 pages | Full UX kit | Standard 5 roles + admin UI | + 2FA + OAuth |
| **Complex** | 40-80+ pages | Full kit + i18n + command palette + optimistic updates | Custom roles + resource ACLs + approval workflows + compliance audit | + SSO + SCIM |

## PRE-CONDITION: Plans Must Be Approved (Complex only)

For Complex projects, **BEFORE writing any code, check:**
1. Does the project have approved plans? Check `plans/MASTER-PLAN.md` status.
2. Are ALL sub-plans approved? Check each plan's status field.
3. Did the user explicitly say to start coding?

**If plans exist but are not all approved:**
- Tell the user which plans still need approval
- Show `/plan status` output
- DO NOT write code

**If all plans are approved:**
1. Check if `IMPLEMENTATION-ROADMAP.md` exists
2. If not, generate it first using `/plan implementation`
3. Follow the roadmap milestone by milestone (see Milestone Validation below)
4. Mark each milestone as complete after validation
5. Update the progress tracker in the roadmap

For **Simple** and **Medium** projects: gates are flexible. A brief design sketch is enough
to start coding, but still use milestone validation between slices.

## Milestone-Based Execution (Rule 23)

Instead of coding the whole project in one shot, break it into **milestones**
(shippable slices). After EACH milestone, STOP and run the validation loop:

```
Milestone finished
      ↓
1. Automated checks (lint, types, tests, build, migrations)
2. Acceptance criteria (from IMPLEMENTATION-ROADMAP.md)
3. Install anything still missing (packages, env vars, migrations, docs)
4. Ask user for missing info (secrets, credentials, design decisions)
5. Update PROJECT.md milestone table with validation date + results
6. Summarize for user, wait for "proceed" before next milestone
```

### Milestone Count by Complexity

- **Simple**: 2-3 milestones
- **Medium**: 4-6 milestones
- **Complex**: 7-10 milestones

### Validation Checks by Complexity

| Check | Simple | Medium | Complex |
|-------|--------|--------|---------|
| Lint | optional | ✓ | ✓ |
| Typecheck | optional | ✓ | ✓ |
| Unit tests | smoke | ✓ | ✓ |
| Integration tests | - | ✓ | ✓ |
| Build | ✓ | ✓ | ✓ |
| Security audit | - | optional | ✓ |
| Migrations apply | ✓ | ✓ | ✓ |

### Skill-Level Adjusted Summaries

After each milestone:

- **Non-Programmer / Beginner** → plain English: "Finished M2. Your database is set up
  with 12 tables. Everything checked out: 14 tests passed, no errors. Ready for M3?"
- **Intermediate / Professional** → technical: show the commands you ran, results,
  and any warnings. "M2: migrations applied (12 tables, 8 indexes). `npm test` 14/14
  green. `npm audit` reports 1 low-severity warning in dev dep (safe to ignore). Ready for M3?"

## GOLDEN RULE: Research Before Code

**BEFORE writing code with ANY framework, library, or tool:**

1. Ask yourself: "Am I 100% sure about the CURRENT API for this?"
2. If ANY doubt: **STOP and research**
3. Use WebSearch to find the official docs
4. Use WebFetch to read the specific docs page
5. Extract the exact syntax, imports, and configuration
6. THEN write code using verified, current information

### What to Research (ALWAYS)
- **ORM setup**: Prisma schema syntax, Drizzle config, SQLAlchemy models, Django models
- **Auth libraries**: NextAuth/Auth.js, Passport.js, FastAPI security, Spring Security
- **UI frameworks**: Tailwind CSS classes, shadcn/ui components, MUI v5+ API
- **State management**: Zustand, TanStack Query, Redux Toolkit current API
- **Build tools**: Vite config, Next.js config, Docker multi-stage builds
- **Testing**: Jest/Vitest setup, Pytest fixtures, Testing Library queries
- **Deployment**: Docker compose syntax, GitHub Actions workflow syntax
- **Any new package**: ALWAYS check npm/pypi for latest version and read quickstart

### Research Workflow Example
```
Task: Set up Prisma with PostgreSQL

Step 1: WebSearch "prisma postgresql quickstart 2026"
Step 2: WebFetch "https://www.prisma.io/docs/getting-started/quickstart"
Step 3: Extract:
  - npx prisma init --datasource-provider postgresql
  - Schema format: model User { id Int @id @default(autoincrement()) ... }
  - Client usage: const prisma = new PrismaClient()
  - Migration: npx prisma migrate dev --name init
Step 4: NOW write the actual code
```

## Stack-Specific Implementation Guides

### Node.js + NestJS + Prisma + React

**Backend Structure (Clean Architecture):**
```
backend/
  src/
    modules/                  # Feature modules (NestJS modules)
      users/
        users.module.ts
        users.controller.ts   # HTTP layer
        users.service.ts      # Application/use case layer
        dto/
          create-user.dto.ts
          update-user.dto.ts
        entities/
          user.entity.ts      # Domain entity
      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
        guards/
          jwt-auth.guard.ts
        strategies/
          jwt.strategy.ts
    common/                   # Shared
      decorators/
      filters/
        http-exception.filter.ts
      interceptors/
        logging.interceptor.ts
        transform.interceptor.ts
      pipes/
        validation.pipe.ts
      middleware/
        rate-limit.middleware.ts
    prisma/                   # Database
      prisma.module.ts
      prisma.service.ts
      schema.prisma
      migrations/
    config/
      configuration.ts
    main.ts
  test/
```

**Frontend Structure (React + Vite):**
```
frontend/
  src/
    components/
      ui/                     # Base components (Button, Input, Card, Modal)
      layout/                 # Header, Sidebar, Footer, PageLayout
      features/               # Feature components grouped by domain
        users/
        dashboard/
        auth/
    pages/                    # Route pages
    hooks/                    # Custom hooks (useAuth, useApi, useDebounce)
    services/
      api.ts                  # Axios instance with interceptors
      auth.service.ts         # Auth API calls
      users.service.ts        # User API calls
    stores/                   # Zustand stores or React Context
    types/                    # TypeScript interfaces
    utils/                    # Helpers (formatDate, validateEmail, etc.)
    routes.tsx                # Route definitions
    App.tsx
    main.tsx
```

### Python + FastAPI + SQLAlchemy + React

**Backend Structure:**
```
backend/
  app/
    main.py                   # FastAPI app entry
    config.py                 # Settings (pydantic-settings)
    dependencies.py           # Dependency injection
    domain/
      entities/
        user.py               # Domain entity (plain Python class)
      interfaces/
        user_repository.py    # Abstract repository
    application/
      use_cases/
        create_user.py
        get_user.py
      dto/
        user_dto.py           # Pydantic models for I/O
    infrastructure/
      database/
        connection.py         # SQLAlchemy engine + session
        models/
          user_model.py       # SQLAlchemy ORM model
        repositories/
          user_repo.py        # Repository implementation
        migrations/           # Alembic migrations
          env.py
          versions/
      http/
        routes/
          users.py            # APIRouter
          auth.py
        middleware/
          auth.py             # JWT middleware
          error_handler.py
          rate_limiter.py
      external/
        email_service.py
        storage_service.py
    shared/
      errors.py               # Custom exceptions
      utils.py
  tests/
    unit/
    integration/
    conftest.py               # Fixtures
  alembic.ini
  pyproject.toml
  Dockerfile
```

### Go + Gin + React

**Backend Structure:**
```
backend/
  cmd/
    server/
      main.go                 # Entry point
  internal/
    domain/
      user.go                 # Entity + repository interface
    application/
      user_service.go         # Use cases
    infrastructure/
      database/
        postgres.go           # DB connection
        user_repo.go          # Repository implementation
      http/
        handlers/
          user_handler.go     # HTTP handlers
        middleware/
          auth.go
          cors.go
          logger.go
        router.go             # Route registration
      config/
        config.go
    dto/
      user_dto.go
  pkg/
    errors/
      errors.go
    validator/
      validator.go
  migrations/
  go.mod
  Dockerfile
```

## Implementation Execution Order

### 1. Initialize Project
Actually run the commands:
```bash
# Create project directories
mkdir -p project-name/{backend,frontend}

# Initialize backend (example: NestJS)
cd project-name
npx @nestjs/cli new backend --package-manager npm --skip-git

# Initialize frontend (example: React + Vite)
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install
```

### 2. Install Dependencies
Research THEN install:
```bash
# Research: WebSearch "prisma install 2026"
# Backend deps
cd backend
npm install @prisma/client bcrypt jsonwebtoken class-validator class-transformer
npm install -D prisma @types/bcrypt @types/jsonwebtoken

# Research: WebSearch "tailwindcss vite setup 2026"
# Frontend deps
cd frontend
npm install axios react-router-dom @tanstack/react-query zustand
npm install -D tailwindcss @tailwindcss/vite
```

### 3. Database Setup
```bash
# Research: WebSearch "prisma init postgresql 2026"
cd backend
npx prisma init --datasource-provider postgresql
# Write schema.prisma based on DESIGN.md data model
# Generate migration
npx prisma migrate dev --name init
# Generate client
npx prisma generate
```

### 4. Implement Backend (Inside-Out)
**Order matters - domain first, infrastructure last:**

1. **Domain entities** - Pure business logic, no imports from framework
2. **DTOs** - Validation schemas for input/output
3. **Use cases / Services** - Application logic
4. **Database models + repositories** - Actual DB queries
5. **Controllers + routes** - HTTP endpoints
6. **Middleware** - Auth, validation, error handling, logging
7. **Config + wiring** - App bootstrap, DI, env vars
8. **Tests** - Unit for domain, integration for API

### 5. Implement Frontend
1. **API client** - Axios/fetch wrapper with auth headers, error handling
2. **Auth flow** - Login page, token storage, protected routes
3. **Layout** - Header, sidebar, navigation
4. **Routing** - Page routes with lazy loading
5. **Feature pages** - Dashboard, CRUD pages, forms
6. **State management** - For complex cross-component state
7. **Polish** - Loading states, error states, empty states, responsive

### 6. Infrastructure
```bash
# Docker for local dev
# Research: WebSearch "docker compose postgresql redis 2026"
cat > docker-compose.yml << 'EOF'
# Write docker-compose with app, db, redis, etc.
EOF

# CI/CD
# Research: WebSearch "github actions node test build 2026"
mkdir -p .github/workflows
# Write CI pipeline

# Environment
cat > .env.example << 'EOF'
# All required env vars with descriptions
EOF
```

### 7. Run & Verify
```bash
# Start infrastructure
docker compose up -d

# Run backend
cd backend && npm run start:dev

# Run frontend
cd frontend && npm run dev

# Run tests
cd backend && npm test
cd frontend && npm test
```

## Error Recovery

When something doesn't work:
1. Read the error message carefully
2. Check if it's a version/API mismatch
3. **Research**: WebSearch the error message
4. **Fetch docs**: Read the relevant docs page
5. Fix and retry
6. If still stuck, try a different approach

## Auto-Documentation (MANDATORY)

Documentation is generated ALONGSIDE code, not after:

1. **After creating API endpoints** -> Write endpoint docs in `docs/API.md`
2. **After creating DB schema** -> Write table docs in `docs/DATABASE.md`
3. **After creating components** -> Write component docs in `docs/frontend/COMPONENTS.md`
4. **After Docker/deployment setup** -> Write `docs/DEPLOYMENT.md`
5. **After adding env vars** -> Update env table in `docs/README.md`
6. **Always generate** -> `docs/README.md` with Quick Start guide

If you accumulate 3+ undocumented endpoints or 5+ changed files without updating docs,
WARN the user and suggest `/docs update`. If 10+ items are undocumented, auto-update.

## Frontend Design Process

When implementing frontend:
1. **ASK the user** about visual style, layout type, and must-have features
2. **Research** the best UI component library for their framework
3. **Fetch docs** for the chosen library before writing any code
4. **Build with real components** from the library (not hand-rolled HTML)
5. Use pre-built components: DataTable, Form, Modal, Toast, Charts, etc.
6. Set up the design system: colors, typography, spacing, dark mode

## Backend Library Selection

When implementing backend:
1. **Research** the best helper libraries for the chosen framework
2. Use established libraries for: validation, auth, logging, caching, queues
3. **Fetch docs** for each library before using it
4. Prefer battle-tested libraries over hand-rolled solutions

## Quality Checks After Each Milestone (MANDATORY)

Run ALL applicable checks at the end of every milestone (see Rule 23):

- [ ] Code compiles/runs without errors
- [ ] Linter passes (all severity: error)
- [ ] Typecheck passes (strict mode)
- [ ] Unit tests pass
- [ ] Integration tests pass (Medium+)
- [ ] API endpoints respond correctly (test with curl/HTTPie)
- [ ] Frontend renders and navigates correctly
- [ ] Error handling works (test with invalid input)
- [ ] Auth flow works end-to-end
- [ ] Database migrations run cleanly
- [ ] Build succeeds (production build)
- [ ] Documentation is up-to-date for what was just built
- [ ] Security audit clean (Complex)
- [ ] No secrets committed

After ALL checks pass:
1. Update `PROJECT.md` → `## Milestones` table (mark Done, add date, note)
2. Summarize for user (style varies by User Skill)
3. List any missing info still needed
4. Wait for "proceed" before starting the next milestone

## Missing Info Request Template

If you need info from the user at a milestone boundary, format it clearly:

```
## Milestone Mn — needs your input

I've [summary of what you built]. Before I continue, I need:

1. [question]
2. [question]
3. [question]

Once you provide these, I'll:
- [next steps]
- [next steps]

(Say "use defaults for everything" to accept my suggestions.)
```
