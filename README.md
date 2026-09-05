# 📄 CV Builder — Mobile Application & Serverless Ecosystem

[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-50.0-000000?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?logo=postgresql&logoColor=white)](https://neon.tech)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com)

A production-ready mobile CV/Resume Builder application built with **React Native**, **Expo**, **TypeScript**, **Vercel Serverless Functions**, **Neon PostgreSQL**, and **Vercel Blob Storage**.

---

## ✨ Features

- 👤 **Account Authentication**: Secure user registration and login powered by Argon2id/bcrypt password hashing & JWT token sessions.
- 📁 **Data-Driven CV Architecture**: Enter information once and render across multiple templates without duplicating or re-typing data.
- 🎨 **Dynamic Template System**:
  - 🆓 **Classic Standard**: Traditional serif layout for corporate and traditional industries.
  - 🆓 **Simple Minimal**: High-whitespace design focused strictly on core content.
  - 🆓 **Professional Slate**: Modern split-header layout for experienced positions.
  - 💎 **Executive Leadership (Premium)**: Sophisticated dual-column template for leadership roles.
  - 💎 **Modern Creative (Premium)**: Vibrant sidebar layout featuring skill badges and photo highlights.
- 📜 **Live A4 Preview & PDF Export**: Instant A4 document preview, high-resolution PDF generation, and native file sharing (`expo-sharing`).
- 💳 **Paystack & Korapay Payment Integration**: Server-side verified checkout and webhook listeners to unlock premium template entitlements.
- ✨ **AI Writing Assistant**: Server-side LLM endpoint for professionalizing summaries and bullet point descriptions.
- 🛡️ **Isolated Admin System**: Complete administrative backend (`/admin`) operating on an isolated database table (`admins`) and API namespace (`/api/admin/...`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Mobile Platform** | React Native + Expo |
| **Navigation** | Expo Router |
| **Language** | TypeScript |
| **Backend API** | Vercel Serverless Functions (`/api`) |
| **Database** | Neon PostgreSQL (Serverless) |
| **ORM** | Drizzle ORM |
| **Storage** | Vercel Blob (`@vercel/blob`) |
| **Auth** | Custom JWT + Argon2id/bcrypt |
| **Payments** | Paystack / Korapay |

---

## 📁 Repository Structure

```
cvbuilder/
├── app/                      # Expo Router Mobile Screens
│   ├── (auth)/               # Login & Registration screens
│   ├── (tabs)/               # Dashboard, My CVs, Templates, Profile
│   ├── cv/                   # CV Wizard & Section Editors
│   └── admin/                # System Admin Portal
├── api/                      # Vercel Serverless Function Routes
│   ├── auth/                 # Account registration & authentication
│   ├── cvs/                  # Structured CV CRUD & section endpoints
│   ├── pdf/                  # A4 PDF document rendering & Blob upload
│   ├── payments/             # Paystack/Korapay checkout & webhooks
│   ├── ai/                   # AI writing enhancement service
│   └── admin/                # Admin analytics, metrics & user management
├── db/                       # Database Setup & Migrations
│   ├── schema/               # Drizzle ORM PostgreSQL schema
│   ├── client.ts             # Neon PostgreSQL serverless client
│   └── seed.ts               # Default templates & initial admin seeder
├── templates/                # Multi-Theme Template Renderers
│   ├── classic.ts            # Classic Standard HTML renderer
│   ├── simple.ts             # Simple Minimal HTML renderer
│   ├── professional.ts       # Professional Slate HTML renderer
│   ├── executive.ts          # Executive Leadership HTML renderer
│   └── modern.ts             # Modern Creative HTML renderer
├── lib/                      # Core Utilities (Auth, Blob, Payments)
└── services/                 # Frontend API Client & SecureStore
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have installed:
- Node.js (v18+)
- npm or yarn

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```

Configure your `.env` variables:
```env
DATABASE_URL=postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=super-secret-jwt-key-change-in-production
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_sample_token
PAYMENT_SECRET_KEY=sk_test_paystack_or_korapay_secret
PAYMENT_PUBLIC_KEY=pk_test_paystack_or_korapay_public
PAYMENT_WEBHOOK_SECRET=whsec_paystack_or_korapay_secret
AI_API_KEY=sk-llm-api-key-sample
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seeding
Push schema tables to Neon PostgreSQL and seed initial templates and admin account:
```bash
npm run db:push
```

### 5. Launch Development Server
```bash
npx expo start
```

---

## 🛡️ Admin Portal

To access the isolated Admin Control Center:
- Open the mobile app and navigate to **Switch to Admin Portal** on the sign-in screen, or navigate directly to `/admin`.
- Default Admin Credentials (created during seed):
  - **Email**: `admin@cvbuilder.com`
  - **Password**: `AdminPassword123!`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
