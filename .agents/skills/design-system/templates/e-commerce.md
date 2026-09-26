# Template: E-Commerce Platform

**Category**: E-Commerce / Online Store
**Complexity**: High

## Architecture
```
Client (Next.js SSR/SSG) -> CDN (images, static)
  -> API Gateway (auth, rate limit)
    -> User Service (auth, profiles)
    -> Product Service (catalog, search)
    -> Cart Service (Redis-backed)
    -> Order Service (state machine)
    -> Payment Service (PSP integration)
    -> Notification Service (email, SMS)
    -> Search Service (Elasticsearch/Meilisearch)
  -> Object Storage (product images)
  -> Message Queue (order processing, notifications)
```

## Tech Stack Template
| Layer | Default | Alternatives |
|-------|---------|-------------|
| Frontend | Next.js + Tailwind | Nuxt, React + Vite |
| Backend | NestJS | FastAPI, Go |
| Database | PostgreSQL | |
| Search | Meilisearch | Elasticsearch |
| Cache | Redis | |
| Payments | Stripe | PayPal, Hyperswitch |
| Queue | Kafka (orders) + BullMQ (tasks) | RabbitMQ |
| Storage | S3 + CloudFront CDN | |
| Auth | NextAuth + JWT | |

## Schema Template
```sql
-- Users
users: id, email, password_hash, name, phone, role, created_at
addresses: id, user_id, label, street, city, state, zip, country, is_default

-- Products
categories: id, name, slug, parent_id, image_url
products: id, name, slug, description, category_id, status, created_at
product_variants: id, product_id, sku, price, compare_at_price, stock, attributes(JSON)
product_images: id, product_id, url, position, alt_text

-- Orders
carts: id, user_id, expires_at (Redis-backed, DB for persistence)
cart_items: id, cart_id, variant_id, quantity
orders: id, user_id, status, subtotal, tax, shipping, total, shipping_address(JSON)
order_items: id, order_id, variant_id, quantity, unit_price
payments: id, order_id, idempotency_key, amount, currency, status, psp_reference

-- Order status: CREATED -> PAID -> PROCESSING -> SHIPPED -> DELIVERED / CANCELLED / REFUNDED
```

## Key Design Decisions
- **Cart**: Redis for speed (TTL 7 days) + persist to DB on checkout
- **Inventory**: Optimistic locking on checkout (check stock, reserve, confirm)
- **Payment**: Idempotency key per order, double-entry ledger, webhook for async confirmation
- **Search**: Sync product data to search engine via CDC or events
- **Images**: Upload to S3, serve via CDN, generate thumbnails async

## Customize By Replacing
- {{STORE_TYPE}}: Fashion, Electronics, Groceries, Digital
- {{PAYMENT_METHODS}}: Credit Card, Bank Transfer, COD
- {{SHIPPING_PROVIDERS}}: FedEx, DHL, local courier
