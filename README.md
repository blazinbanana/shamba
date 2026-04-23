# SHAMBA — Crop Progress Tracker

A field management system for tracking crop progress across multiple fields during a growing season.

---

## Tech Stack

- **Next.js 15** 
- **Supabase** 
- **shadcn/ui** + **Tailwind CSS**
- **TypeScript**

---

## Features

| Feature | Admin | Field Agent |
|---|---|---|
| Dashboard overview | can All fields | can Assigned fields |
| Create / edit / delete fields | can | cannot |
| Assign agents to fields | can | cannot |
| View all field updates | can | can (assigned fields) |
| Log field updates & stage changes | cannot | can |
| Manage team roles | can | cannot |

---

## Design decisions

```
Planted → Growing → Ready → Harvested
```

---

### Field Status Logic

Each field carries a **computed status** derived from its stage and temporal data. No extra database column is needed — it's computed in `lib/field-utils.ts` at read time.

### `active`
The field is progressing normally. No anomalies detected.

### `at_risk`
Triggered by any of these conditions:

| Condition | Logic |
|---|---|
| Stage is **Planted** and `planting_date` was > **21 days** ago | Seeds should have germinated and progressed within 3 weeks. Stagnation indicates possible germination failure or neglect. |
| Stage is **Growing** and `updated_at` was > **30 days** ago | A healthy growing field should be monitored monthly. Lack of updates may signal abandonment or agent inaction. |
| Stage is **Ready** and `updated_at` was > **10 days** ago | A crop left "ready" for too long risks overripening, pest damage, or spoilage. |

### `completed`
The field's stage is **Harvested**. The growing cycle is done.

## assumptions made
> Admin can see all fields  - no containerization done for them
> Admin can turn Field Agent into Admin if they want to

---

## set up instructions
1. Open the demo link provided
2. Sign up or sign in with your actual google account
3. Use one account to sign up as Admin, and a different account as Field Agent
4. Passcode for Admin is `mkuru`