# Digital Wallet — Progress Log

Short log of what was done and what’s next. Keep bullets scannable; don’t invent features.

---

## Previously done

- Full-stack Digital Wallet: React 19 + Vite + Tailwind (FE), Spring Boot 3 + JWT + JPA + PostgreSQL (BE)
- UI redesign / design system (layout, tokens, shared form/page components)
- Flow fixes: Request money creates real PENDING (balances unchanged); Add Money no fake category; sign-out clears React Query cache
- Maintainability + security/perf: env secrets (`.env.example`), auth/categorize rate limits, `@EntityGraph` on transactions, `spring.jpa.open-in-view=false`, request validation (`@Valid`), related hardening
- Tests: FE Vitest (Login, Send, Request, AddMoney, CategorySuggest, utils/api); BE JUnit (WalletService, Insight, SecurityApi, etc.); fixed TOPUP `addMoney` EntityGraph bug when sender == receiver
- Lint/build verification (`npm run lint` / `npm run build`; `mvn test`)

---

## In progress / current

Nothing in progress. Final audit completed 2026-10-16 (see Done).

---

## How to use this file

**Future agents:** when you finish meaningful work, update this file in the same change set.

1. Move finished items into **Done** (or append under a dated heading).
2. Keep **In progress / current** accurate — reflect real files/routes/imports, not plans.
3. Prefer short dated bullets, e.g.:

```md
### 2026-10-16
- Done: wired `NotFound` into `App.jsx` catch-all
```

Do not fabricate features. Do not commit/push unless the user asks.

---

## Done (dated)

### 2026-10-16 — Interview polish COMPLETE

- `README.md` — real local setup (Docker Postgres, BE/FE), demo walkthrough, scripts, JWT/`OPENAI_API_KEY` notes
- `EmptyState` / `ErrorPanel` wired (Dashboard, Transactions, `TransactionList` empty + filtered-empty)
- `NotFound` routed in `App.jsx` (`path="*"` → `<NotFound />`, not silent redirect to dashboard)
- A11y: skip link (`#main-content`), nav `aria-label`s (Primary / Mobile), `aria-busy` / `aria-live` on balance, success, loading status
- Filtered vs empty activity states; loading skeletons (`TransactionSkeleton`)
- Send / Add / Request submit loading via `ActionButton` `aria-busy`
- Verified (polish agent): `npm test` 25/25, oxlint clean, `vite` build OK

### 2026-10-16
- Added this `PROGRESS.md` at repo root as the working memory log

### 2026-10-16 � Final audit

- Re-ran checks: FE tests 25/25, oxlint clean, vite build OK; BE tests 23/23 BUILD SUCCESS
- Live E2E not verified (API :8080 / Postgres :5432 down; Vite :5173 up)
- README: added Known limitations + PROGRESS.md in layout
- UI critique: dark gold + Inter still reads template-like; request fulfill gap remains
