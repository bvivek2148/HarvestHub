# HarvestHub 🌾

HarvestHub is a premium, high-performance farm-to-table marketplace designed for the Indian market. It connects local farmers directly with buyers, ensuring fresh produce, fair pricing, and secure transactions.

## 🚀 Getting Started

To run the application in development mode:

```bash
bun install
bun run dev
```

The app will be available at `http://localhost:3000`.

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React + Query + Router)
- **Database & Storage**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage)
- **Auth**: [Clerk](https://clerk.com/) (Role-based access control)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Firebase Configuration
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL` 
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Clerk Configuration
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## 📦 Project Structure

- `src/components/farm`: Core marketplace components (Hero, Market, Dashboards)
- `src/routes`: File-based routing system
- `src/server/functions`: Server-side logic for Listings, Orders, and Users
- `src/hooks`: Custom React hooks for Firebase and Auth
- `public/`: Optimized assets and icons

## 📜 Available Scripts

- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run start`: Start production server
- `bun run lint`: Run ESLint check
- `bun run format`: Format code with Prettier

## 🛡️ License

Private Project - All rights reserved.
