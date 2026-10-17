# Digital Wallet

Full-stack demo wallet: register/sign in, view balance, send money, top up, request money, and browse activity with spending insights.

**Stack:** React 19 + Vite + Tailwind · Spring Boot 3 + JWT + JPA · PostgreSQL

---

## Prerequisites

- Node.js 20+
- Java 21+
- Maven 3.9+
- Docker (for Postgres) **or** a local PostgreSQL 16 instance

---

## Local setup

### 1. Database

From `backend/`:

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with:

| Setting  | Value           |
|----------|-----------------|
| Database | `digital_wallet` |
| User     | `postgres`      |
| Password | `postgres`      |

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080`

**No Docker / Postgres?** Run with the in-memory H2 profile instead:

```bash
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

Data resets when the API stops. Prefer Postgres + Docker for a lasting demo.

Optional env overrides (see `.env.example`):

- `JWT_SECRET` — use a long random value outside local demos
- `OPENAI_API_KEY` — optional; without it, categorization falls back to keywords / `OTHER`

### 3. Frontend

From the repo root:

```bash
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`  
`VITE_API_URL` defaults to `http://localhost:8080`.

---

## Demo walkthrough (interview)

1. **Register** two users (e.g. `alice@example.com`, `bob@example.com`).
2. **Sign in** as Alice → **Add money** (e.g. ₹1000).
3. **Send** ₹250 to Bob with a description like “Zomato lunch” (watch category suggestion).
4. Open **Activity** — history, filters, and monthly spend chart.
5. As Alice, **Request** money from Bob (creates a **Pending** row; balances unchanged).
6. Sign out / sign in as Bob to confirm the transfer credit.

---

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Frontend unit/UI tests |
| `npm run lint` | Oxlint |
| `mvn -f backend/pom.xml test` | Backend tests |
| `mvn -f backend/pom.xml spring-boot:run` | Start API |

---

## Project layout

```
├── src/                 # React app
├── backend/             # Spring Boot API + docker-compose
├── .env.example         # Frontend / backend env hints
├── PROGRESS.md          # Working log of completed work
└── README.md
```

---

## Notes

- JWT is stored in `localStorage` for this demo (simple for local runs; not production hardening).
- LLM categorization is optional; the app works without an OpenAI key.
- Do not commit `.env` or real secrets.

---

## Known limitations (demo scope)

- **Request money** creates a `PENDING` ledger row only — no accept/pay/decline flow yet.
- **Add money** credits the wallet directly (no real payment provider).
- JWT default secret is for local runs; override `JWT_SECRET` before any shared deploy.
- Rate limiting is in-memory (not shared across multiple API instances).
- No refresh tokens, email verification, or KYC.
- Frontend production bundle is a single large JS chunk (~700KB+) — fine for demo, not optimized for CDN delivery.
