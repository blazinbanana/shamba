# 🌱 SHAMBA — Crop Progress Tracker

A full-stack field management system for tracking crop progress across multiple fields during a growing season.

---

## Tech Stack

- **Next.js 15** (App Router)
- **Supabase** (Auth, PostgreSQL, RLS)
- **shadcn/ui** + **Tailwind CSS**
- **TypeScript**

---

## Features

| Feature | Admin | Field Agent |
|---|---|---|
| Dashboard overview | ✅ All fields | ✅ Assigned fields |
| Create / edit / delete fields | ✅ | ❌ |
| Assign agents to fields | ✅ | ❌ |
| View all field updates | ✅ | ✅ (own fields) |
| Log field updates & stage changes | ❌ | ✅ |
| Manage team roles | ✅ | ❌ |

---

## Field Lifecycle

```
Planted → Growing → Ready → Harvested
```

---

## Field Status Logic

Each field carries a **computed status** derived from its stage and temporal data. No extra database column is needed — it's computed in `lib/field-utils.ts` at read time.

### `active`
The field is progressing normally. No anomalies detected.

### `at_risk`
Triggered by any of these conditions:

| Condition | Rationale |
|---|---|
| Stage is **Planted** and `planting_date` was > **21 days** ago | Seeds should have germinated and progressed within 3 weeks. Stagnation indicates possible germination failure or neglect. |
| Stage is **Growing** and `updated_at` was > **30 days** ago | A healthy growing field should be monitored monthly. Lack of updates may signal abandonment or agent inaction. |
| Stage is **Ready** and `updated_at` was > **10 days** ago | A crop left "ready" for too long risks overripening, pest damage, or spoilage. |

### `completed`
The field's stage is **Harvested**. The growing cycle is done.

---

## Getting Started

1. Clone the repo and install dependencies:
```bash
   npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials.

3. Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.

4. Enable Google OAuth in Supabase → Authentication → Providers.

5. Add `http://localhost:3000/auth/callback` to Supabase → Authentication → URL Configuration.

6. Run the dev server:
```bash
   npm run dev
```