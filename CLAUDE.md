# CLAUDE.md

## Project Overview

CV to Web is a web application that lets users upload their CV/resume as a PDF and instantly generates a hosted portfolio website. Users get a shareable subdomain like `username.cvtoweb.com`.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic) for CV parsing
- **PDF Parsing**: pdf-parse library
- **Hosting**: Vercel (planned)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page with PDF upload
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── api/
│   │   ├── parse-cv/route.ts       # POST: Upload PDF → Extract text → Claude AI → JSON
│   │   └── publish/route.ts        # POST: Claim username & publish portfolio
│   ├── preview/[id]/page.tsx       # Preview portfolio before publishing
│   ├── published/page.tsx          # Success page after publishing
│   └── portfolio/[username]/page.tsx # Public portfolio page (SSR)
├── components/
│   ├── PortfolioTemplate.tsx       # Renders portfolio from JSON data
│   └── PublishModal.tsx            # Modal for claiming username
├── lib/
│   ├── supabase.ts                 # Supabase client (browser + admin)
│   └── parse-cv.ts                 # Claude API integration for CV parsing
├── types/
│   └── portfolio.ts                # TypeScript interfaces
└── middleware.ts                   # Subdomain routing (username.domain.com → /portfolio/username)
```

## Key Data Flow

1. User uploads PDF on landing page
2. `/api/parse-cv` extracts text with pdf-parse, sends to Claude API
3. Claude returns structured JSON (name, experience, education, skills, contact)
4. Portfolio saved to Supabase with `is_published: false`
5. User sees preview, clicks publish, enters username + email
6. `/api/publish` claims username, sets `is_published: true`
7. Portfolio accessible at `username.cvtoweb.com` via middleware rewrite

## Database Schema (Supabase)

```sql
portfolios (
  id UUID PRIMARY KEY,
  user_id UUID,              -- optional, for future auth
  username TEXT UNIQUE,      -- becomes subdomain
  email TEXT,
  portfolio_data JSONB,      -- the parsed CV data
  template TEXT DEFAULT 'default',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Portfolio Data Structure

```typescript
interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    dates: string;
    location?: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    dates: string;
    location?: string;
  }>;
  skills: string[];
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    website?: string;
    location?: string;
  };
}
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_DOMAIN=cvtoweb.com
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Current State

The project is scaffolded with all core files in place:
- Landing page with drag-and-drop upload ✓
- API routes for parsing and publishing ✓
- Preview page ✓
- Portfolio template ✓
- Publish modal ✓
- Subdomain middleware ✓
- Database schema ✓

## What Needs Work

- [ ] Connect to real Supabase instance
- [ ] Test full flow end-to-end
- [ ] Add more portfolio templates
- [ ] Add editing capability after publish
- [ ] Add authentication for returning users
- [ ] Custom domain support (premium feature)
- [ ] Better error handling
- [ ] Loading states and skeleton screens
- [ ] SEO optimization for portfolio pages
- [ ] Analytics tracking

## Code Conventions

- Use TypeScript strictly
- Components are functional with hooks
- API routes use Next.js App Router conventions
- Tailwind for all styling (no CSS modules)
- Keep components in `/components`, utilities in `/lib`
- Types in `/types`

## Important Notes

- PDF parsing happens server-side only
- Claude API key must never be exposed to client
- Supabase service role key is for API routes only
- Middleware handles subdomain → route rewriting
- All portfolio pages are server-rendered for SEO
