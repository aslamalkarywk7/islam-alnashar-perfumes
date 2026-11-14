# ISLAM AL-NASHAR · إسلام النشار

**A full-stack, bilingual (Arabic RTL / English LTR) luxury-perfume commerce platform.**
Eight signature fragrances with AI-generated campaign imagery, JWT auth, cart & coupons,
transactional checkout, reviews, wishlist, and a role-protected admin dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Feature Matrix](#feature-matrix)
- [AI Product Imagery](#ai-product-imagery)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)

---

## Overview

Islam Al-Nashar is a maison de parfum, and this repository is its storefront platform:
an Arabic-first, RTL-native shopping experience with a full EN/LTR translation. The design
language is editorial luxury — sand paper (`#f5f2ed`), ink (`#1a1a1a`), antique gold
(`#c8b49c`), Cormorant Garamond + Amiri serif titles, and full-bleed product photography.

The platform ships with **eight fragrances across seven olfactive families** (Oud, Floral,
Amber, Musk, Fresh, Woody, Oriental), each carrying its own concentration, size, note pyramid,
ratings and reviews. Every product image was **generated with AI (Recraft via OpenRouter)** and
is bundled locally — no external CDN at runtime.

All prices are stored and transmitted as **integer minor units** (halalas) and formatted for
display only at the edges via `Intl.NumberFormat` (SAR).

## Feature Matrix

| Area | Capabilities |
| --- | --- |
| **Catalog** | Paginated listing, search (AR/EN), fragrance-family filter, price range, 5 sort orders, featured collection |
| **Perfume page** | Cover gallery, note pyramid, size/concentration/family/SKU, stock badges, reviews with rating aggregates |
| **Cart** | Guest cart (localStorage) merged into the server cart on login, stock-aware limits |
| **Checkout** | Address form, coupon validation, COD or card (simulated gateway), transactional order creation |
| **Orders** | History, details, cancellation with automatic stock restoration & coupon refund |
| **Reviews** | 1–5 stars, one per user/product (DB-enforced), denormalized aggregates |
| **Wishlist** | Per-user favourites |
| **Auth** | JWT (7-day), bcrypt hashing, `customer`/`admin` role guards on API and routes |
| **Admin** | KPI dashboard, perfume CRUD (soft delete), order status workflow, coupon management |
| **i18n** | Arabic-first RTL with instant EN/LTR switch, persisted preference, localized currency & dates |

## AI Product Imagery

The nine campaign images in `public/images/` (eight fragrances + hero) were generated with
**Recraft `recraft-v4.1-flash-v2`** through the OpenRouter API, then optimised with Pillow
(≤1100 px, WebP quality 80 → ~320 KB total). Prompts used a single editorial style contract —
dark charcoal backdrop, golden rim light, glass bottle, minimal composition, no text — so the
set reads as one cohesive campaign.

Regeneration is scriptable: call OpenRouter `POST /api/v1/chat/completions` with the Recraft
model and a product prompt; the response returns a base64 data URL in
`choices[0].message.images[0].image_url.url`.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript (strict), React Router 7, Tailwind CSS 4, i18next, Motion |
| Backend | Node.js, Express 4, better-sqlite3 (WAL), Zod validation, jsonwebtoken, bcryptjs |
| Payments | Simulated card gateway behind a `PaymentService` interface (COD supported) |
| Imagery | Recraft v4.1 via OpenRouter (generated offline, bundled as WebP) |
| Build | Vite 6, tsx (server), concurrently (one-command dev) |

## Database Schema

11 tables (`server/src/db/schema.sql`), FK-constrained with indexes:

| Table | Purpose |
| --- | --- |
| `users` | Accounts, `role` check (`customer`/`admin`), bcrypt hashes |
| `addresses` | Saved shipping addresses |
| `categories` | Olfactive families with bilingual names |
| `products` | The sellable fragrance: SKU/slug, bilingual name & description, integer price, stock, JSON images, **plus** `size_ml`, `concentration`, and `notes` JSON (`{ar: [], en: []}`) |
| `carts` / `cart_items` | Server cart, unique per (cart, product) |
| `coupons` | percent/fixed, min subtotal, max uses, expiry |
| `orders` | Order number, 7-status workflow, payment method/status, totals & shipping snapshot |
| `order_items` | **Price & title snapshot at purchase time** |
| `reviews` | 1–5 rating, unique per (product, user) |
| `wishlist_items` | Unique per (user, product) |

Seed data: 7 families, 8 fragrances (with bespoke Arabic copy and note pyramids), 2 coupons,
3 users, and seeded reviews.

## API Reference

All routes under `/api` — JSON in/out.

| Method & Path | Auth | Description |
| --- | --- | --- |
| `POST /auth/register` · `POST /auth/login` | — | Returns `{token, user}` |
| `GET/PATCH /auth/me` | JWT | Session / profile |
| `GET /products` | — | `q`, `category`, `featured`, `price_min/max`, `sort`, `page`, `per_page` |
| `GET /products/:slug` | — | Fragrance + 4 related |
| `GET/POST /products/:id/reviews` | JWT* | Reviews (*write requires auth) |
| `GET/POST/PATCH/DELETE /cart…` | JWT | Cart + `POST /cart/merge` for guest carts |
| `POST /coupons/validate` | — | Non-destructive coupon check |
| `POST /orders` | JWT | Transactional checkout (`cod`, `card`) |
| `GET /orders` · `GET /orders/:orderNumber` | JWT | History / details |
| `POST /orders/:orderNumber/cancel` | JWT | Cancel + restock + refund coupon |
| `GET/POST/DELETE /wishlist…` | JWT | Favourites |
| `GET /admin/stats` | Admin | Revenue, best sellers, low stock, recent orders |
| `GET/POST/PATCH/DELETE /admin/products…` | Admin | Fragrance CRUD (soft delete) |
| `GET/POST/DELETE /admin/categories…` | Admin | Family management |
| `GET/PATCH /admin/orders…` | Admin | Order workflow |
| `GET/POST/DELETE /admin/coupons…` | Admin | Coupon management |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Run

```bash
git clone https://github.com/aslamalkarywk7/website-one.git aura-perfumes
cd aura-perfumes
npm install
npm run dev        # API :3001 + Vite :5173 (proxied) in one command
```

Open **http://localhost:5173**. The database is created and seeded automatically on first run.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | API + client concurrently with hot reload |
| `npm run build` | Production client build to `dist/` |
| `npm start` | Production server (serves `dist/` + API on :3001) |
| `npm run lint` | Strict typecheck of both client and server |
| `npm run db:reset` | Drop, migrate, and reseed |

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@aura.com` | `Admin@123` |
| Customer | `sara@example.com` | `User@123` |
| Customer | `omar@example.com` | `User@123` |

Active coupons: `AURA10` (10%, min SAR 300) · `VIP100` (SAR 100 off, min SAR 500).

## Testing

A 22-assertion end-to-end smoke suite passes against a freshly seeded database:

- catalogue listing/search/family filter, perfume metadata (size, concentration, notes)
- image paths resolve to bundled assets
- customer & admin login, cart add
- coupon validation (10%)
- card checkout with exact totals, order listing, cancellation with restock
- review creation, wishlist
- admin stats, perfume create + soft delete
- auth guard

A browser pass confirms the storefront, AR↔EN direction flip (RTL/LTR), the perfume page with
note pyramid and reviews, and the luxurious campaign imagery.

## Project Structure

```
├── index.html
├── vite.config.ts              # React + Tailwind + /api proxy
├── public/images/              # AI-generated campaign imagery (WebP)
│   ├── hero.webp
│   └── perfumes/*.webp
├── src/                        # ── Client ──
│   ├── main.tsx                # Providers, router, self-hosted fonts
│   ├── App.tsx                 # Route tree with auth/admin guards
│   ├── i18n/                   # ar.json / en.json dictionaries + direction manager
│   ├── context/                # AuthContext (JWT), CartContext (guest↔server merge)
│   ├── lib/                    # api client, money formatting, debounce
│   ├── components/             # PerfumeCard, RatingStars, Pagination, Toast, layout…
│   └── pages/                  # home, catalog, perfume detail, cart, checkout, auth
│       ├── account/            #   profile, orders, order details, wishlist
│       └── admin/              #   dashboard, fragrances, orders, coupons
└── server/                     # ── API ──
    └── src/
        ├── index.ts            # Express app, route mounting, SPA serving
        ├── db/                 # schema.sql, connection, migrate, seed
        ├── lib/                # errors, pricing/coupons, DTO serializers
        ├── middleware/         # JWT auth, admin guard, zod parsing, error handler
        ├── services/           # payment gateway abstraction
        └── routes/             # auth, products, cart, coupons, orders, reviews, wishlist, admin
```

## Roadmap

- [ ] PayPal / Moyasar integration behind the `PaymentService` interface
- [ ] Gift cards & discovery sets (multi-item bundles)
- [ ] Fragrance quiz ("find your scent")
- [ ] Email notifications on order status change
- [ ] Full test suite (Vitest unit + Playwright E2E) in CI
- [ ] PostgreSQL migration path (SQL isolated in route/lib layers)
