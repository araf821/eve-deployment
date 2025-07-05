# NextAuth Authentication Demo

A complete authentication system built with Next.js 15, NextAuth v5, Google & Discord OAuth, Drizzle ORM, and Neon DB.

## Features

- 🔐 Authentication with Google and Discord
- 💾 User data stored in Neon PostgreSQL database
- 🏗️ Drizzle ORM for type-safe database operations
- 🔒 Server-side session management
- 🎨 Tailwind CSS for styling
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth v5
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### 1. Environment Variables

Update the `.env.local` file with your actual credentials:

```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Neon Database
DATABASE_URL=your-neon-database-url
```

### 2. Get OAuth Credentials

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

#### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "OAuth2" section
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret

### 3. Database Setup

#### Neon DB Setup

1. Sign up at [Neon](https://neon.tech/)
2. Create a new database
3. Copy the connection string to `DATABASE_URL`

#### Run Database Migrations

```bash
npm run db:push
```

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the authentication demo.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
web/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API routes
│   ├── layout.tsx                       # Root layout with SessionProvider
│   └── page.tsx                         # Main demo page
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx             # Sign in button component
│   │   └── SignOutButton.tsx            # Sign out button component
│   └── SessionProvider.tsx              # Client-side session provider
├── lib/
│   └── auth.ts                          # NextAuth configuration
├── server/
│   ├── db/
│   │   ├── index.ts                     # Database connection
│   │   └── schema.ts                    # Drizzle schema definitions
│   └── lib/
│       └── auth.ts                      # Server-side auth helpers
├── types/
│   └── next-auth.d.ts                   # NextAuth type definitions
├── drizzle.config.ts                    # Drizzle configuration
└── .env.local                           # Environment variables
```

## How It Works

1. **Authentication Flow**: Users can sign in with Google or Discord
2. **Session Management**: NextAuth handles sessions with database storage
3. **User Data**: User information is stored in Neon DB via Drizzle ORM
4. **Server Components**: Main page uses server components to fetch user data
5. **Client Components**: Auth buttons use client components for interactivity

## Key Files

- `lib/auth.ts` - NextAuth configuration with providers and callbacks
- `server/db/schema.ts` - Database schema for users, accounts, sessions
- `server/lib/auth.ts` - Server-side helpers for getting current user/session
- `components/auth/` - Reusable authentication components
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API endpoints

## Next Steps

- Add middleware for route protection
- Implement role-based access control
- Add more OAuth providers
- Customize sign-in pages
- Add user profile management
