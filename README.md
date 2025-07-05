# Eve - Your Personal Campus Beacon

A friendly digital companion that acts as a personal light in the dark, ensuring every student on campus feels connected and safe during any walk, day or night.

## 🌟 About Eve

Eve transforms campus safety through community connection rather than fear. Built as a Progressive Web App, it provides three core safety features that work together to create a comprehensive campus safety network.

### Core Features

**🤝 Buddy System**  
Connect with trusted friends who can track your walks in real-time. Choose a buddy from your crew, and they'll see your "light" moving safely across the map until you reach your destination.

**🤖 AI Guardian**  
Smart monitoring that acts as your automated safety companion. If you stop moving unexpectedly during a walk, the AI Guardian gently checks in with you and can alert your buddy if needed.

**🗺️ Community Glow Map**  
A living map powered by community insights. Drop "Glow" pins for well-lit, safe areas and "Heads-up" pins for areas that need attention. See real-time safety information from your campus community.

## ✨ Features

- 🔐 **Secure Authentication** - Sign in with Google or Discord
- 📱 **Mobile-First Design** - Optimized for on-the-go campus use
- 🗺️ **Google Maps Integration** - Real-time location tracking and route planning
- 👥 **Buddy Management** - Add friends, manage availability, and coordinate safety
- 🚶 **Guided Walks** - Start tracked walks with destination and buddy selection
- 📍 **Community Pins** - Share and discover safety insights across campus
- 🚨 **Emergency Alerts** - One-tap emergency button with instant buddy notification
- 💬 **Real-time Communication** - Live updates and notifications via WebSockets
- 📱 **PWA Support** - Install as a native app on any device
- 🌙 **Smart Monitoring** - AI-powered movement analysis and check-ins

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth v5 (AuthJS) with OAuth providers
- **Database**: PostgreSQL via NeonDB with Drizzle ORM
- **Maps**: Google Maps JavaScript API
- **Real-time**: WebSockets for live tracking and notifications
- **UI**: Shadcn/ui components with Tailwind CSS
- **PWA**: Service Workers with offline support
- **AI**: Smart monitoring and automated check-ins
- **Language**: TypeScript with full type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- PostgreSQL database (NeonDB recommended)
- Google Cloud Console account (for Maps API)

### 1. Environment Setup

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# AI Service (Optional)
OPENAI_API_KEY="your-openai-api-key"
```

### 2. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project and enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`

### 3. Google Maps Setup

1. In Google Cloud Console, enable Maps JavaScript API
2. Create API key and restrict to your domain
3. Add the key to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 4. Database Setup

#### NeonDB Setup
1. Sign up at [Neon](https://neon.tech/)
2. Create new database
3. Copy connection string to `DATABASE_URL`

#### Initialize Database
```bash
bun run db:push
```

### 5. Install & Run

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Visit `http://localhost:3000` to start using Eve!

## 📜 Available Scripts

```bash
# Development
bun dev                 # Start development server
bun build              # Build for production
bun start              # Start production server

# Code Quality
bun lint               # Run ESLint
bun format             # Format with Prettier
bun format:check       # Check formatting

# Database
bun db:generate        # Generate migrations
bun db:migrate         # Run migrations
bun db:push           # Push schema changes
bun db:studio         # Open Drizzle Studio
```

## 📱 How to Use Eve

### Getting Started
1. **Sign Up**: Create account with Google or Discord
2. **Add Buddies**: Invite trusted friends to your safety crew
3. **Set Availability**: Toggle when you're available to be a buddy

### Starting a Guided Walk
1. **Open Eve** and tap "Start Walk"
2. **Set Destination** by tapping the map or entering an address
3. **Choose Buddy** from your available crew members
4. **Start Walking** - your buddy will see your live location
5. **Arrive Safely** - automatic check-in when you reach your destination

### Being a Buddy
1. **Get Notified** when a friend starts a walk
2. **Track Progress** on the live map
3. **Receive Alerts** if the AI Guardian detects issues
4. **Stay Connected** until your friend arrives safely

### Using Community Features
1. **View Glow Map** to see community safety insights
2. **Add Pins** after walks to share your experience
3. **Plan Routes** using community-recommended paths
4. **Stay Informed** about campus safety trends

### Emergency Features
1. **Emergency Button** - Large red button for instant alerts
2. **Auto-Location Sharing** - Sends precise location to your buddy
3. **Escalation Options** - Can contact campus security if configured

## 📁 Project Structure

```
web/
├── app/
│   ├── (landing)/              # Public landing page
│   ├── (auth)/                 # Authentication pages
│   ├── (dashboard)/            # Main application
│   │   ├── dashboard/          # Dashboard home
│   │   │   ├── buddies/        # Buddy management
│   │   │   ├── walk/           # Walk features
│   │   │   │   ├── start/      # Start new walk
│   │   │   │   └── [id]/       # Active walk tracking
│   │   │   └── map/            # Community map
│   │   └── layout.tsx          # App navigation
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth endpoints
│   │   ├── walks/              # Walk management
│   │   ├── buddies/            # Buddy system
│   │   └── pins/               # Community pins
│   └── globals.css             # Design system
├── components/
│   ├── auth/                   # Authentication UI
│   ├── walk/                   # Walk tracking components
│   ├── map/                    # Google Maps integration
│   ├── buddy/                  # Buddy system UI
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── auth.ts                 # Authentication config
│   ├── maps.ts                 # Google Maps utilities
│   └── websocket.ts            # Real-time communication
├── server/
│   ├── db/                     # Database layer
│   ├── services/               # Business logic
│   └── websocket/              # WebSocket server
└── middleware.ts               # Route protection
```

## 🔒 Privacy & Security

- **Location Data**: Encrypted in transit, automatically deleted after walks
- **Buddy Permissions**: Users control exactly who can track them when
- **Emergency Override**: Emergency features can override privacy settings
- **Data Retention**: Minimal data storage with automatic cleanup
- **GDPR Compliant**: Full user control over personal data

## 🌍 Campus Deployment

Eve is designed to scale across university campuses:

- **Multi-tenant Architecture**: Supports multiple campuses
- **Campus-specific Maps**: Customized for each campus layout
- **Integration Ready**: Can connect with campus security systems
- **Analytics Dashboard**: Campus administrators can view safety trends
- **Customizable Features**: Adapt to specific campus needs

## 🤝 Contributing

Eve is built with campus safety in mind. We welcome contributions that enhance student safety through technology and community connection.

## 📄 License

This project is focused on campus safety innovation and community building.

---

**Built with ❤️ for campus safety and community connection**
