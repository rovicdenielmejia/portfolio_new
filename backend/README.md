# Portfolio Backend - Admin CMS

A full-stack portfolio management system built with Next.js 14, Prisma, and PostgreSQL.

## Features

- **Dashboard**: Overview stats and recent activity
- **Inquiries Management**: View, filter, and manage client inquiries
- **Portfolio CMS**: Add, edit, and organize portfolio items with image uploads
- **Services Manager**: Manage service offerings with features and pricing
- **Blog CMS**: Create and publish blog posts with SEO support
- **Settings**: Configure site title, contact info, and social links

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Image Upload**: Cloudinary
- **UI**: Custom CSS with glassmorphism design

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your-secret-key-at-least-32-characters"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

5. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

6. Create an admin user:

You can use the register endpoint or create directly in the database:

```bash
# Start the server and use the API
npm run dev
```

Then create an admin user via the API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password", "name": "Admin"}'
```

7. Start the development server:

```bash
npm run dev
```

8. Open the admin dashboard at `http://localhost:3000/admin/login`

## Project Structure

```
backend/
├── app/
│   ├── admin/
│   │   ├── (dashboard)/     # Dashboard routes
│   │   │   ├── page.tsx     # Main dashboard
│   │   │   ├── inquiries/   # Inquiries management
│   │   │   ├── portfolio/   # Portfolio CMS
│   │   │   ├── services/    # Services manager
│   │   │   ├── blog/        # Blog CMS
│   │   │   └── settings/    # Site settings
│   │   ├── login/           # Login page
│   │   ├── admin-layout.tsx # Admin layout wrapper
│   │   ├── sidebar.tsx     # Sidebar component
│   │   ├── header.tsx       # Header component
│   │   ├── providers.tsx    # Auth provider
│   │   └── globals.css      # Admin styles
│   └── api/
│       ├── auth/            # Authentication routes
│       ├── blog/            # Blog CRUD
│       ├── inquiries/       # Inquiries CRUD
│       ├── portfolio/       # Portfolio CRUD
│       ├── services/        # Services CRUD
│       ├── settings/        # Settings CRUD
│       ├── stats/           # Dashboard stats
│       └── upload/          # Image upload
├── lib/
│   └── prisma.ts            # Prisma client
└── prisma/
    └── schema.prisma        # Database schema
```

## API Routes

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register new user

### Inquiries
- `GET /api/inquiries` - List all inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries/[id]` - Get single inquiry
- `PUT /api/inquiries/[id]` - Update inquiry
- `DELETE /api/inquiries/[id]` - Delete inquiry

### Portfolio
- `GET /api/portfolio` - List portfolio items
- `POST /api/portfolio` - Create item
- `GET /api/portfolio/[slug]` - Get single item
- `PUT /api/portfolio/[slug]` - Update item
- `DELETE /api/portfolio/[slug]` - Delete item

### Services
- `GET /api/services` - List services
- `POST /api/services` - Create service
- `GET /api/services/[slug]` - Get single service
- `PUT /api/services/[slug]` - Update service
- `DELETE /api/services/[slug]` - Delete service

### Blog
- `GET /api/blog` - List posts
- `POST /api/blog` - Create post
- `GET /api/blog/[slug]` - Get single post
- `PUT /api/blog/[slug]` - Update post
- `DELETE /api/blog/[slug]` - Delete post

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT token signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key for emails |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

## Deployment

### Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in Vercel dashboard

4. Configure PostgreSQL database (Vercel Postgres or external)

## License

MIT
