# Run Digital Wallet end-to-end

Use this guide on Windows (PowerShell / VS Code terminal).  
Project root: `C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet`

---

## What you need running

| Piece | URL / port | Role |
|--------|------------|------|
| Frontend (Vite) | http://localhost:5173 | UI |
| Backend (Spring Boot) | http://localhost:8080 | API |
| Database | Postgres `:5432` **or** H2 (in-memory) | Data |

---

## Option A — Fastest (no Docker) — recommended if Docker is missing

Uses in-memory **H2**. Data resets when you stop the API.

### 1. Start the API

```powershell
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet\backend"
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

Wait until you see something like:

```text
Started DigitalWalletApplication
```

Leave this terminal open.

### 2. Start the frontend (new terminal)

```powershell
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet"
npm install
npm run dev
```

Open: **http://localhost:5173**

### 3. Demo walkthrough

1. Register user A: e.g. `alice@example.com` / password ≥ 6 chars  
2. Register user B: e.g. `bob@example.com` (sign out first, or use a private window)  
3. Sign in as Alice → **Add money** → e.g. `1000`  
4. **Send** → Bob’s email → amount `250` → optional description like `Zomato lunch`  
5. Open **Activity** — see transfer + insights  
6. **Request** money from Bob → creates a **Pending** row (balances do not change)  
7. Sign out → sign in as Bob → confirm credit of ₹250  

---

## Option B — Full stack with Postgres (Docker)

Use this when Docker Desktop is installed and running.

### 1. Start Postgres

```powershell
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet\backend"
docker compose up -d
docker compose ps
```

Check port:

```powershell
Test-NetConnection localhost -Port 5432
```

`TcpTestSucceeded : True` means DB is up.

Defaults (from `docker-compose.yml`):

- DB: `digital_wallet`
- User: `postgres`
- Password: `postgres`

### 2. Start the API (no `local` profile)

```powershell
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet\backend"
mvn spring-boot:run
```

### 3. Start the frontend

Same as Option A step 2.

---

## Health checks (if something fails)

```powershell
Test-NetConnection localhost -Port 5173   # frontend
Test-NetConnection localhost -Port 8080   # API
Test-NetConnection localhost -Port 5432   # Postgres (Option B only)
```

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| “Cannot reach the server” | API not on `:8080` | Start backend; wait for “Started…” |
| Hibernate / Dialect / JDBC errors | DB not running | Use Option A (`local`) or start Docker Postgres |
| `docker` not recognized | Docker not installed / not in PATH | Use Option A, or install Docker Desktop and restart the terminal |
| CORS / blank auth errors | Wrong API URL | Frontend expects `VITE_API_URL=http://localhost:8080` (see `.env.example`) |

Optional frontend env:

```powershell
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet"
copy .env.example .env
```

---

## Stop everything

- Frontend / API: `Ctrl+C` in each terminal  
- Postgres (Option B):  

```powershell
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet\backend"
docker compose down
```

---

## Useful commands

```powershell
# Frontend tests
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet"
npm test
npm run lint
npm run build

# Backend tests
cd "C:\Users\Siddeshwar J\Desktop\5CSN01\Digital_Wallet\backend"
mvn test
```

---

## Notes

- JWT is stored in the browser (`localStorage`) for this demo.  
- LLM category suggestion is optional; leave `OPENAI_API_KEY` empty if you don’t have one.  
- **Request money** only creates a pending ledger entry — there is no accept/pay step yet.  
- With Option A (H2), restarting the API clears all users and balances.
