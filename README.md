# CV to Web

Transform your CV into a stunning portfolio website in seconds.

## Features

- **Upload PDF** → AI extracts your information automatically
- **Instant Preview** → See your portfolio before publishing
- **Custom Subdomain** → Get `yourname.cvtoweb.com`
- **Mobile Responsive** → Looks great on all devices
- **No Sign Up Required** → Preview without creating an account

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **PDF Parsing**: pdf-parse
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/cvtoweb.git
cd cvtoweb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema in `supabase/schema.sql`
3. Get your project URL and keys from Settings > API

### 4. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ANTHROPIC_API_KEY` - Your Claude API key
- `NEXT_PUBLIC_APP_DOMAIN` - Your domain (e.g., cvtoweb.com)

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cvtoweb.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add your environment variables
3. Deploy!

### 3. Configure Custom Domain

1. Add your domain in Vercel project settings
2. Add a wildcard subdomain: `*.yourdomain.com`
3. Update your DNS records as instructed

## Project Structure

```
cvtoweb/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parse-cv/      # CV parsing endpoint
│   │   │   └── publish/       # Portfolio publishing endpoint
│   │   ├── portfolio/[username]/  # Public portfolio pages
│   │   ├── preview/[id]/      # Portfolio preview
│   │   ├── published/         # Success page after publishing
│   │   └── page.tsx           # Landing page with upload
│   ├── components/
│   │   ├── PortfolioTemplate.tsx  # Portfolio renderer
│   │   └── PublishModal.tsx       # Publish form modal
│   ├── lib/
│   │   ├── parse-cv.ts        # Claude AI parsing logic
│   │   └── supabase.ts        # Supabase client
│   ├── types/
│   │   └── portfolio.ts       # TypeScript types
│   └── middleware.ts          # Subdomain routing
├── supabase/
│   └── schema.sql             # Database schema
└── .env.example               # Environment variables template
```

## How It Works

1. User uploads a PDF CV
2. `pdf-parse` extracts text from the PDF
3. Claude AI structures the text into JSON (name, experience, skills, etc.)
4. Portfolio is saved to Supabase (unpublished)
5. User previews and chooses a username
6. Portfolio is published and accessible at `username.yourdomain.com`
7. Middleware rewrites subdomain requests to the portfolio page

## License

MIT
