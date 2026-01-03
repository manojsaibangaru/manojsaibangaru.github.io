# Accommodation App - Frontend

A modern, full-featured accommodation and room-sharing web application built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

### Pages
- **Landing Page** - Hero section, search bar, featured listings, and call-to-action
- **Login & Registration** - Complete authentication flows with validation
- **Listings Browser** - Grid view with filters, pagination, and search
- **Listing Details** - Image gallery, amenities, pricing, and contact owner
- **Dashboard** - User overview with statistics and quick actions
- **Add Listing** - Multi-step form for creating new listings

### Components
- Responsive Navbar with mobile menu
- Footer with links and social media
- Listing cards with save functionality
- Advanced search bar
- Dashboard sidebar navigation
- Protected route wrapper
- Loading and error states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd accommodation-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the API base URL:
```
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/workspace/
├── app/
│   ├── dashboard/
│   │   ├── add-listing/
│   │   └── page.tsx
│   ├── listings/
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── login/
│   ├── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ListingCard.tsx
│   ├── SearchBar.tsx
│   ├── Sidebar.tsx
│   ├── ProtectedRoute.tsx
│   ├── Loading.tsx
│   └── ErrorMessage.tsx
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── mock-data.ts
├── types/
│   └── index.ts
└── package.json
```

## Features Overview

### Authentication
- Email/password login with validation
- User registration with role selection (Tenant/Owner)
- Password strength requirements
- Protected routes with authentication guards

### Listings
- Browse all available accommodations
- Advanced filtering (city, price, room type, bedrooms)
- Save/favorite listings
- Detailed listing view with image gallery
- Contact property owners

### Dashboard
- Overview statistics
- Recent and saved listings
- Quick actions
- Responsive sidebar navigation
- Mobile-friendly bottom navigation

### Add Listing
- Multi-step form (4 steps)
- Image upload with preview
- Amenities selection
- Validation at each step
- Review before submission

## API Integration

This is a **frontend-only** application. All API calls are placeholder implementations using mock data. To integrate with a real backend:

1. Update the `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Ensure your backend implements the expected API endpoints (see `lib/api.ts`)
3. Update the mock data usage in components to use real API responses

### Expected API Endpoints

```
POST /auth/login
POST /auth/register
GET  /auth/me

GET  /listings
GET  /listings/:id
POST /listings
PUT  /listings/:id
DELETE /listings/:id

GET  /users/profile
PUT  /users/profile
GET  /users/my-listings
GET  /users/saved-listings
```

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Accessibility

- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states for all interactive elements
- Alt text for images

## Building for Production

```bash
npm run build
npm run start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
