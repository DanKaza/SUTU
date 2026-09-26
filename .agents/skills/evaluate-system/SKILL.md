---
name: evaluate-system
description: System evaluation and audit skill - triggered when reviewing, auditing, or evaluating existing systems, architectures, or codebases. Checks against best practices from all 8 books.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Agent
---

# System Evaluation Skill

You are evaluating an existing system. Be thorough and constructive.

## Evaluation Process

### Phase 1: Discovery
1. Read and understand the current codebase/architecture
2. Map all components and their interactions
3. Identify data flows and dependencies
4. Check the current tech stack and versions
5. Understand the current scale and growth trajectory

### Phase 2: Multi-Dimensional Evaluation

Evaluate against these dimensions (from all 8 books):

#### Architecture Quality (Clean Architecture)
- Does it follow the Dependency Rule?
- Are business rules isolated from frameworks/DB?
- Are SOLID principles applied at component level?
- Are component boundaries well-defined?
- Is it testable without external dependencies?

#### Code Quality (Clean Code + Refactoring)
- Check for code smells (Fowler's 24 smells catalog)
- Are functions small and single-purpose?
- Are names meaningful and intention-revealing?
- Is error handling comprehensive?
- Is there unnecessary duplication?
- Are design patterns applied appropriately (GoF)?

#### Data Systems (DDIA)
- Is the replication strategy appropriate?
- Are partitioning decisions sound?
- Is the consistency model appropriate?
- Are encoding/evolution concerns handled?
- Is the storage engine appropriate for the workload?

#### Construction Quality (Code Complete)
- Is defensive programming in place?
- Are there proper integration strategies?
- Is the testing strategy comprehensive?
- Is complexity managed effectively?

#### System Design (Alex Xu)
- Are there single points of failure?
- Is caching used appropriately?
- Is the database choice justified?
- Are there proper scaling strategies?
- Is the API design sound?

### Phase 3: Scoring
Rate each dimension from 1-10 and provide overall health score.

### Phase 4: Prioritized Recommendations
Organize findings by: CRITICAL -> HIGH -> MEDIUM -> LOW
Each finding includes: Problem, Impact, Recommendation, Effort, Priority.

## Output
Generate a comprehensive evaluation report with score card and action items.
