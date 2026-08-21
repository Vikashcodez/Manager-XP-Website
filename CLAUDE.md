# ManagerXP — Production SaaS Development Rules

ManagerXP is a **production-ready, multi-tenant SaaS platform**.

The platform supports multiple customers/tenants, where each tenant may have multiple cafés, branches, users, staff, PCs, sessions, billing, products, customers, subscriptions and other business data.

## Development Scope

You may work across the entire codebase when required:

- Website
- Frontend
- Applications
- Backend
- APIs
- Database
- Infrastructure
- Authentication
- Authorization
- Billing
- Subscriptions
- Integrations
- AI
- Testing
- Security
- CI/CD

Do not artificially restrict work to a specific layer. Use the correct layer required to solve the task.

## Production Standard

Treat every change as a production change.

- Preserve existing functionality.
- Do not break existing workflows or APIs.
- Reuse existing architecture and components where appropriate.
- Avoid unnecessary dependencies or rewrites.
- Maintain backward compatibility where required.
- Keep the system secure, scalable, reliable and maintainable.
- Do not invent business claims, customers, statistics or capabilities.

Before completing a change:

1. Inspect the relevant implementation.
2. Understand dependencies and existing behaviour.
3. Implement the change.
4. Run appropriate tests and checks.
5. Test affected existing functionality.
6. Perform security and tenant-isolation checks.
7. Fix issues caused by the change.
8. Verify build/deployment impact.
9. Report what was changed and what was tested.

Never claim something was tested or fixed unless it was actually verified.

## Multi-Tenant Architecture

ManagerXP must always be treated as a **multi-tenant SaaS platform**.

A tenant represents an independent customer/business using ManagerXP.

A tenant may have:

- Multiple cafés
- Multiple branches
- Multiple users
- Multiple roles
- Multiple staff members
- Multiple PCs/stations
- Multiple sessions
- Billing and invoices
- Products and inventory
- Customers
- Subscriptions
- Reports
- Settings
- Other tenant-specific data

### Tenant Isolation

Tenant isolation is mandatory.

A user from Tenant A must never be able to access, modify, delete or infer protected data belonging to Tenant B.

Never rely only on frontend filtering.

Tenant authorization must be enforced server-side.

Never trust tenant identifiers supplied by:

- Request body
- Query parameters
- URL parameters
- Headers
- Frontend state
- AI prompts

Use authenticated server-side context to determine the tenant whenever possible.

Every tenant-scoped query, API, service and operation must enforce tenant isolation.

## Café and Branch Isolation

A tenant may contain multiple cafés and branches.

Always distinguish between:

`Tenant → Café → Branch → Resources`

Access must respect the user's assigned tenant, café, branch and permissions.

Do not assume that access to one café means access to all cafés.

Do not assume that access to one branch means access to all branches unless the user's role explicitly permits it.

## Authentication & Authorization

All protected operations must validate:

- Authentication
- Tenant membership
- Café access
- Branch access
- Role
- Permission
- Resource ownership

Frontend permissions are never sufficient.

Authorization must always be enforced on the server.

Prevent:

- Authentication bypass
- Authorization bypass
- IDOR
- Privilege escalation
- Cross-tenant access
- Cross-café access
- Cross-branch access

## Database

All tenant-scoped database operations must be tenant-safe.

- Use parameterized queries.
- Prevent SQL injection.
- Preserve existing data.
- Use transactions where required.
- Use appropriate indexes.
- Avoid unbounded queries.
- Avoid accidental cross-tenant queries.
- Test migrations before deployment.
- Do not perform destructive operations unnecessarily.

If a table does not directly contain tenant information, use the established relationship/join required to safely determine the tenant.

## API Security

Every protected API must enforce appropriate:

- Authentication
- Tenant authorization
- Café/branch authorization
- Input validation
- Rate limiting
- Pagination
- Timeouts
- Error handling

Never trust client-provided tenant ownership.

Never expose sensitive internal information through API responses or errors.

## Security

Security is mandatory across the entire platform.

Protect against common vulnerabilities including:

- SQL injection
- XSS
- CSRF
- SSRF
- IDOR
- Authentication bypass
- Authorization bypass
- Privilege escalation
- Cross-tenant data access
- Path traversal
- Unsafe file uploads
- Secret exposure
- Sensitive data exposure
- Rate-limit abuse
- Dependency vulnerabilities

Never:

- Hard-code secrets.
- Expose passwords, tokens or API keys.
- Log secrets.
- Return stack traces in production.
- Trust client-side authorization.
- Trust client-provided tenant ownership.

## Billing, Payments & Subscriptions

Billing and subscription functionality must be tenant-aware.

Maintain correct isolation for:

- Plans
- Subscriptions
- Usage
- Invoices
- Payments
- Refunds
- Discounts
- Transactions
- Branch limits
- Café limits
- Feature access

Never allow one tenant to view or modify another tenant's billing information.

Financial operations must be idempotent and auditable where required.

## CafeXP AI

Reference:

`backend/docs/backend/ai.md`

CafeXP AI must operate within the authenticated tenant/café context.

Rules:

- The model never sources business numbers.
- Business figures are calculated by `src/modules/ai/ai.tools.js`.
- Never give the model raw database access.
- Never allow the model to write SQL.
- AI tools must be read-only, parameterized, tenant-scoped and limited.
- Café identity comes from `req.actor.cafe_id`.
- Never trust café IDs from the request or model.
- Dates come from `ai.dates.js`.
- Never let the model determine relative dates.
- Never guess when data does not support a conclusion.
- Never expose another tenant's data.
- Never log secrets or raw café data.
- Keep AI access behind the appropriate permission.

## Testing

Test relevant scenarios including:

- Happy paths
- Validation
- Error handling
- Authentication
- Authorization
- Tenant isolation
- Café isolation
- Branch isolation
- Role/permission boundaries
- Duplicate requests
- Concurrent operations
- Database failures
- API failures
- Integration failures
- Billing/payment scenarios
- Subscription scenarios
- Regression scenarios
- Responsive behaviour

Where applicable run:

- Unit tests
- Integration tests
- API tests
- End-to-end tests
- Build checks
- Lint checks
- Type checks
- Security checks

## Performance & Scalability

Design for multiple tenants operating concurrently.

Avoid:

- N+1 queries
- Unbounded queries
- Full-table operations
- Excessive API calls
- Memory leaks
- Unnecessary polling
- Large unnecessary payloads

Use appropriate:

- Pagination
- Indexing
- Caching
- Background jobs
- Efficient queries
- Connection pooling

Performance improvements must not compromise tenant isolation or correctness.

## Reliability

Handle:

- Timeouts
- Retries
- Duplicate processing
- Partial failures
- Worker failures
- Network failures
- Database failures

Use idempotency for operations where duplicate execution could cause business or financial problems.

## Secrets

Never commit or expose:

- Passwords
- API keys
- Access tokens
- Database credentials
- Private keys
- Encryption keys
- Webhook secrets

Use secure environment/configuration mechanisms.

## UI / UX

ManagerXP should maintain a premium SaaS/gaming technology aesthetic:

- Black background
- ManagerXP red accent
- Clean typography
- Premium technology feel
- Responsive desktop/tablet/mobile
- Accessible UI
- Consistent design system

Do not replace existing assets unnecessarily.

## Final Rule

**ManagerXP is a multi-tenant SaaS platform, not a single-café application.**

Every feature, API, database query, permission, report, billing operation, AI operation and UI workflow must be designed with tenant isolation and production scalability in mind.

**Make every requested change production-ready, secure, tested, tenant-safe and without breaking existing functionality.**