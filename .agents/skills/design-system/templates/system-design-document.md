# System Design: [System Name]

**Author**: [name]
**Date**: [date]
**Status**: Draft | In Review | Approved
**Version**: 1.0

---

## 1. Requirements

### 1.1 Functional Requirements
- FR1: [Users can ...]
- FR2: [System should ...]
- FR3: [Admin can ...]

### 1.2 Non-Functional Requirements
| Requirement | Target |
|-------------|--------|
| Scale | [X DAU, Y requests/day] |
| Latency | [p99 < X ms] |
| Availability | [99.9% SLA] |
| Consistency | [Strong / Eventual] |
| Durability | [No data loss / acceptable loss] |

### 1.3 Out of Scope
- [Feature X -- will be added in v2]

### 1.4 Assumptions
- [Assumption 1]
- [Assumption 2]

---

## 2. Capacity Estimation

| Metric | Calculation | Result |
|--------|------------|--------|
| DAU | | |
| Avg QPS | DAU x req/user / 86400 | |
| Peak QPS | Avg QPS x 3 | |
| Storage/day | writes/day x size/write | |
| Storage/year | storage/day x 365 x replication | |
| Bandwidth | QPS x avg_response_size | |
| Cache size | hot_data x entry_size x 20% | |
| Servers | Peak_QPS / QPS_per_server | |

---

## 3. API Design

### 3.1 [Resource] API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/[resource] | Create | Yes |
| GET | /api/v1/[resource]/:id | Get by ID | Yes |
| GET | /api/v1/[resource] | List (paginated) | Yes |
| PUT | /api/v1/[resource]/:id | Update | Yes |
| DELETE | /api/v1/[resource]/:id | Delete | Yes |

### Request/Response Examples
```json
// POST /api/v1/[resource]
// Request
{ "field1": "value1", "field2": "value2" }

// Response 201
{ "id": "uuid", "field1": "value1", "created_at": "ISO-8601" }

// Error Response
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

---

## 4. Data Model

### 4.1 Entity: [Name]

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| field1 | VARCHAR(255) | NOT NULL, INDEX | |
| created_at | TIMESTAMP | NOT NULL, INDEX | |
| updated_at | TIMESTAMP | NOT NULL | |

### 4.2 Indexes
- `idx_[table]_[field]` on ([field]) -- for [query pattern]

### 4.3 Relationships
- [Entity A] 1:N [Entity B] via [foreign_key]

---

## 5. High-Level Architecture

### 5.1 Components

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Client | Web/Mobile app | React/Flutter |
| API Gateway | Routing, auth, rate limiting | Nginx/Kong |
| App Server | Business logic | Node.js/Python/Go |
| Database | Persistent storage | PostgreSQL |
| Cache | Hot data, sessions | Redis |
| Queue | Async processing | Kafka/RabbitMQ |
| Object Store | Files, media | S3 |
| CDN | Static assets | CloudFront |

### 5.2 Data Flow
1. Client -> CDN (static) / API Gateway (dynamic)
2. API Gateway -> Auth + Rate Limit -> App Server
3. App Server -> Cache (check first) -> Database (on miss)
4. Write: App Server -> Database + invalidate cache
5. Async: App Server -> Queue -> Worker

---

## 6. Deep Dive

### 6.1 [Critical Component 1]
- **Design**: [detailed design]
- **Algorithm/Approach**: [specifics]
- **Technology**: [choice] because [justification]
- **Trade-offs**: Chose [A] over [B] because [reason]
- **Scaling**: [how it scales]

### 6.2 [Critical Component 2]
[Same structure]

### 6.3 Database Design Decisions
- **Why [SQL/NoSQL]**: [justification based on access patterns]
- **Sharding strategy**: [if needed: key, approach, when]
- **Replication**: [master-slave, sync/async]

### 6.4 Caching Strategy
- **What to cache**: [hot data, computed results]
- **Strategy**: [cache-aside / write-through / etc.]
- **Eviction**: [LRU / TTL of X minutes]
- **Invalidation**: [on write / event-driven / TTL]

---

## 7. Scaling Plan

| Scale | Strategy |
|-------|----------|
| Current (< 10K DAU) | Single server, vertical scaling |
| 10x (100K DAU) | LB + multiple servers, read replicas, cache |
| 100x (1M DAU) | Sharding, distributed cache, CDN, async |
| 1000x (10M DAU) | Microservices, multi-region, cell architecture |

---

## 8. Reliability & Operations

### 8.1 Failure Scenarios

| Failure | Impact | Mitigation | Recovery |
|---------|--------|------------|----------|
| DB primary down | No writes | Auto-failover | Promote replica |
| Cache down | Increased latency | Fallback to DB | Restart + warm |
| App server crash | Reduced capacity | LB removes node | Auto-restart |

### 8.2 Monitoring
- **Metrics**: Rate, errors, latency (p50/p95/p99), saturation
- **Logs**: Structured JSON with trace IDs
- **Alerts**: Error rate > 1%, p99 > 500ms, disk > 80%
- **SLI/SLO**: Availability 99.9%, latency p99 < 200ms

### 8.3 Security
- [ ] HTTPS everywhere
- [ ] JWT authentication
- [ ] RBAC authorization
- [ ] Input validation
- [ ] Encryption at rest
- [ ] Rate limiting
- [ ] Audit logging

---

## 9. Architecture Decision Records

### ADR-001: [Decision Title]
**Status**: Accepted
**Context**: [Why]
**Decision**: [What]
**Consequences**: [Trade-offs]

---

## 10. Future Improvements
- [ ] [Improvement 1] -- Priority: High
- [ ] [Improvement 2] -- Priority: Medium
- [ ] [Improvement 3] -- Priority: Low
