# Template: SaaS Dashboard Application

**Category**: Web Application (Admin Dashboard / SaaS)
**Complexity**: Medium-High

## Architecture
```
Client (React/Vue SPA)
  -> CDN (static assets)
  -> API Gateway (auth, rate limit, routing)
    -> Auth Service (JWT, OAuth, RBAC)
    -> Core API Service (business logic)
      -> PostgreSQL (primary data)
      -> Redis (cache, sessions, rate limits)
    -> Background Workers
      -> Message Queue (async tasks)
    -> Notification Service (email, push)
  -> Object Storage (file uploads)
```

## Tech Stack Template
| Layer | Default | Alternatives |
|-------|---------|-------------|
| Frontend | React + shadcn/ui + Tailwind | Vue + PrimeVue, Next.js |
| Backend | NestJS + Prisma | FastAPI + SQLAlchemy |
| Database | PostgreSQL | MySQL |
| Cache | Redis | |
| Auth | JWT + Refresh Tokens | OAuth 2.0 + OIDC |
| Queue | BullMQ (Redis) | Kafka (if high volume) |
| Storage | S3 / MinIO | |
| Monitoring | Prometheus + Grafana | |
| Deployment | Docker + CI/CD | Kubernetes at scale |

## Schema Template
```sql
-- Multi-tenant base
tenants: id, name, subdomain, plan, settings(JSON), created_at
users: id, tenant_id, email, password_hash, role, status, created_at
roles: id, tenant_id, name, permissions(JSON)

-- Audit trail
audit_logs: id, tenant_id, user_id, action, entity, entity_id, changes(JSON), ip, created_at
```

## API Template
```
Auth:     POST /auth/login, /auth/register, /auth/refresh, /auth/forgot-password
Users:    CRUD /api/v1/users (admin), GET/PUT /api/v1/users/me (self)
Tenants:  GET/PUT /api/v1/tenants/current (settings)
[Domain]:  CRUD /api/v1/[resources] (per-tenant, RBAC-protected)
```

## Frontend Layout
```
Sidebar (collapsible) + Top Navbar + Main Content
- Dashboard (stats cards + charts)
- Data tables (sortable, filterable, paginated)
- Forms (create/edit with validation)
- Settings (profile, tenant, preferences)
- Dark/Light mode toggle
```

## Customize By Replacing
- {{TENANT_TYPE}}: University, Company, Organization
- {{PRIMARY_ENTITY}}: Students, Products, Orders
- {{BUSINESS_RULES}}: Enrollment logic, pricing, workflows
