# Template: REST API Service (Backend Only)

**Category**: API Service / Microservice
**Complexity**: Medium

## Architecture
```
Client (any) -> Load Balancer -> API Servers (stateless)
                                    -> PostgreSQL (primary)
                                    -> Redis (cache)
                                    -> Message Queue (async tasks)
                                    -> External APIs (third-party)
```

## Tech Stack Template
| Layer | Default | Alternatives |
|-------|---------|-------------|
| Framework | NestJS (TypeScript) | FastAPI (Python), Go + Gin |
| ORM | Prisma | SQLAlchemy, GORM |
| Database | PostgreSQL | MySQL, MongoDB |
| Cache | Redis | Memcached |
| Queue | BullMQ | Celery, asynq |
| Auth | JWT + RBAC | API Keys + HMAC |
| Docs | Swagger (auto-generated) | |
| Testing | Jest + Supertest | Pytest + httpx |
| Deployment | Docker + GitHub Actions | |

## Project Structure (Clean Architecture)
```
src/
  modules/
    [feature]/
      [feature].module.ts
      [feature].controller.ts     # HTTP layer
      [feature].service.ts        # Business logic
      dto/create-[feature].dto.ts # Validation
      entities/[feature].entity.ts
  common/
    filters/http-exception.filter.ts
    interceptors/logging.interceptor.ts
    guards/jwt-auth.guard.ts
    pipes/validation.pipe.ts
  prisma/
    schema.prisma
    prisma.service.ts
  config/
  main.ts
```

## API Template
```
Health:   GET /health/live, /health/ready
Auth:     POST /api/v1/auth/login, /refresh
CRUD:     GET/POST/PUT/DELETE /api/v1/[resources]
Nested:   GET /api/v1/[parent]/:id/[children]

Headers: Authorization (Bearer JWT), Idempotency-Key, X-Request-ID
Pagination: Cursor-based (?cursor=x&limit=20)
Errors: { error: { code, message, details[], request_id } }
Rate Limit: 1000 req/min authenticated, 100 unauthenticated
```

## Middleware Stack
```
Request -> CORS -> Rate Limiter -> Auth Guard -> Validation Pipe
       -> Controller -> Service -> Repository -> Database
       -> Logging Interceptor -> Transform Interceptor -> Response
       -> Error Filter (global)
```

## Customize By Replacing
- {{SERVICE_NAME}}: payment-service, user-service
- {{PRIMARY_RESOURCE}}: payments, users, orders
- {{AUTH_METHOD}}: JWT, API Key, OAuth
