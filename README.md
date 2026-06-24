<div align="center">
  <img src="https://img.shields.io/badge/CampusFlow-ERP-111111?style=for-the-badge" alt="CampusFlow ERP" />
  <h1>🏫 CampusFlow ERP</h1>
  <p><strong>The Future of Educational Operations. Fast. Brutalist. Unbreakable.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React_Native-0.81.5-blue?style=flat-square&logo=react" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-54.0.0-black?style=flat-square&logo=expo" alt="Expo" />
    <img src="https://img.shields.io/badge/NestJS-11.0.0-red?style=flat-square&logo=nestjs" alt="NestJS" />
    <img src="https://img.shields.io/badge/Prisma-6.4.1-blue?style=flat-square&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-green?style=flat-square&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Upstash-Redis-red?style=flat-square&logo=upstash" alt="Upstash" />
  </p>
</div>

<br />

> **The Problem:** Traditional school roll calls steal 10-15 minutes of instructional time every single day. Multiplied across thousands of classes, schools lose years of educational potential to administrative friction.
> 
> **The Solution:** CampusFlow ERP. A hyper-optimized, mobile-first platform that completely eradicates manual attendance through sub-second QR code scanning, wrapped in a breathtaking brutalist-minimalist interface.

---

## ✨ Why CampusFlow?

### 🚀 Blistering Fast Attendance (O(1) Redis Scanning)
We don't query a database when a student scans their ID. We query memory. By hydrating class rosters into **Upstash Redis** before a session starts, we achieve **O(1) time complexity lookups**. The result? You can scan 50 students in under 60 seconds with zero lag and instant haptic feedback.

### 📶 Unbreakable Offline-First Engineering
Schools are notorious for WiFi dead zones. With CampusFlow, if a teacher loses connection mid-scan, the app doesn't break. Our proprietary `SyncQueue` securely caches encrypted scans directly to local device storage. The second the device detects an internet connection, it aggressively syncs the backlog in the background.

### 🏢 Ironclad Multi-Tenant Architecture
Built for enterprise B2B SaaS deployment. We utilize strict **Row-Level Security (RLS)** in PostgreSQL and hard-coded tenant boundary checks in our NestJS services. Data from School A is cryptographically and logically isolated from School B. No leaks. No overlapping.

### 🎨 The "Brutalist-Minimalist" Experience
We threw away the boring corporate UI playbook. CampusFlow features stark contrasts, aggressive typography, fluid 60FPS micro-animations via `Reanimated` & `Moti`, and satisfying tactile feedback. It doesn’t just look like a premium app; it *feels* alive.

### 🕵️ Audit-First Compliance
Every critical action—from an Admin reassigning a teacher to a teacher correcting a past attendance record—is aggressively logged into an immutable `AuditLog` table. Full forensic traceability for school administrators.

---

## 🏗️ The Tech Stack Arsenal

### 📱 Frontend (The Command Center)
- **Engine**: React Native + Expo (SDK 54)
- **Routing**: Expo Router for seamless, web-like deep linking.
- **State Dominance**: TanStack React Query (v5) handles aggressive caching and optimistic UI updates so the app never feels like it's "loading".
- **Styling**: NativeWind (TailwindCSS) for rapid, responsive design tokens.
- **Hardware**: `expo-camera` for real-time machine vision (QR) and `expo-haptics` for physical feedback.

### ⚙️ Backend (The Engine Room)
- **Core**: NestJS (Node.js) providing a strictly typed, modular architecture.
- **Database ORM**: Prisma Client mapped to a PostgreSQL engine.
- **Memory Cache**: Upstash Redis pipeline for instantaneous data retrieval.
- **Authentication**: A custom JWT `SupabaseStrategy`. We use **JIT (Just-In-Time) Profile Linking** to seamlessly merge decentralized Supabase Auth accounts with our centralized multi-tenant Postgres `profiles` table upon first login.

---

## 🚀 The Operational Lifecycle

1. **The Setup**: Administrators log into the Operations HQ. They provision teachers, construct classes, and issue Student QR identities.
2. **The Handshake (JIT Auth)**: A Teacher logs in for the first time. The backend intercepts the login, securely verifies their email against the Admin's provisioned list, and permanently binds their device to their identity.
3. **The Pre-Flight Check**: The Teacher opens their dashboard and taps **Start Session**. The backend instantly pulls the class roster from Postgres and loads it into Redis RAM.
4. **The Onslaught (Live Scanning)**: Students walk in and scan. The camera parses the QR, hits the Redis cache in `~10ms`, fires a success haptic vibration, and optimistically updates the live counter UI on the screen.
5. **The Aftermath**: Scans are batch-processed and permanently stored in Postgres. Discrepancy reports and metrics are aggregated live for the Principal's dashboard.

---

## 🛠️ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Supabase Account & CLI
- Upstash Redis Account
- Expo Go (or iOS Simulator / Android Emulator)

### 1. Clone & Install
```bash
git clone https://github.com/samyakdande/Attendance-app.git
cd Attendance-app

# Prepare the Backend
cd backend
npm install

# Prepare the Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `/backend` directory:
```env
# Supabase Transaction Pooler (Port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true"
# Supabase Direct Connection (Port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-pooler.supabase.com:5432/postgres"

SUPABASE_JWT_SECRET="your_jwt_secret"
SUPABASE_ANON_KEY="your_anon_key"

# Upstash Redis
REDIS_URL="rediss://default:[TOKEN]@[ENDPOINT].upstash.io:6379"
```

Create a `.env` file in the `/frontend` directory:
```env
EXPO_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT].supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
EXPO_PUBLIC_BACKEND_URL="http://10.0.2.2:3000" # Remember to use your local IP for physical devices!
```

### 3. Ignite the Database
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Launch Sequence
**Fire up the API Engine:**
```bash
cd backend
npm run start:dev
```

**Launch the Mobile Interface:**
```bash
cd frontend
npx expo start -c
```

---

<div align="center">
  <p><i>"Reclaiming instructional time, one millisecond at a time."</i></p>
  <p><b>Built by Samyak Dande</b></p>
</div>
