# SkillSwap Backend

This directory contains the Node.js + Express + TypeScript backend API for **SkillSwap**, powered by **Neo4j AuraDB**. It manages user profile synchronization, skill matching, session requests, transaction history ledger logs, and atomic session completions (updating karma balances).

## Features

- **Express + TypeScript Core:** Structured and type-safe routing.
- **Neo4j Graph Database:** Native graph-based matching via Cypher queries.
- **Atomic Karma Lifecycle:** Handles karma adjustments and logs transactions atomically on session completion.
- **Onboarding and Profile Synchronization:** Keeps profiles, teaches, and learns in sync between local client databases and the graph.
- **Graceful Fallbacks:** Built for resilience; works alongside client-side offline mock fallbacks.

---

## Tech Stack

- **Node.js** (v18+)
- **Express** - Fast, unopinionated web framework.
- **TypeScript** - Strict type safety.
- **neo4j-driver** - Official driver to connect to Neo4j.
- **ts-node-dev** - Fast dev-reload compiler.

---

## Getting Started

### 1. Install Dependencies

From this directory, run:
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the backend folder:
```bash
cp .env.example .env
```
Open `.env` and fill in your connection details for your Neo4j AuraDB instance:
```env
PORT=4000
NEO4J_URI=neo4j+s://<your-auradb-subdomain>.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<your-auradb-password>
CORS_ORIGIN=http://localhost:8081
```

### 3. Seed the Database

Populate your Neo4j database with starter users, skills, and posts:
```bash
npm run seed
```

### 4. Run the Development Server

Start the API server in watch mode:
```bash
npm run dev
```
The server will start on port `4000` (e.g. `http://localhost:4000`).

---

## Available Scripts

- `npm run dev` - Starts the development server using `ts-node-dev`.
- `npm run seed` - Runs the Neo4j database seeder script.
- `npm run build` - Compiles TypeScript files into JavaScript in `/dist`.
- `npm run start` - Runs the compiled application in production.
- `npm run typecheck` - Compiles the project without emitting files to check for typescript errors.

---

## API Endpoints

### Health Check
- `GET /health` - Confirms server is running and tests connection to Neo4j.

### User Profiles
- `GET /users/:id` - Fetch user profile along with lists of skill IDs to teach/learn.
- `POST /users` - Create or update a user profile (onboarding) and sync their teach/learn skills.
- `PUT /users/:id/skills` - Update a user's skills to teach and learn.

### Swap Listings
- `GET /posts` - List all open posts.
- `POST /posts` - Create a new post (type 'teach' or 'learn').

### Match Recommendations
- `GET /matches/:userId` - Runs a Cypher matching recommendation query based on mutual skill complementaries and preferences. Falls back to other users' open posts if no relationships exist.

### Swap Sessions
- `GET /swaps/user/:userId` - Fetch all sessions where the user is either the teacher or the learner.
- `POST /swaps/request` - Request a swap on a post. Generates a pending `SwapSession` node and relationships.
- `POST /swaps/:id/accept` - Transitions session status to `accepted`.
- `POST /swaps/:id/decline` - Transitions session status to `declined`.
- `POST /swaps/:id/complete` - Atomically marks the session as `completed`, logs positive/negative `KarmaTransaction` nodes linked to users, and updates users' `karmaBalance` values.

### Karma Transactions
- `GET /karma/:userId` - Fetch transaction ledger log entries for a user.
