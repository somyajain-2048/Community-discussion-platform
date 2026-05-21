# Community Platform

A full-stack social community platform with real-time messaging, post interactions, community management, and an admin dashboard. Built with a Node.js/Express backend and a Next.js frontend.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js 5 |
| ORM | Prisma |
| Database | PostgreSQL |
| Real-time | Socket.io |
| Auth | JWT (access + refresh tokens) |
| File Storage | Cloudinary + Multer |
| Password | bcrypt |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| State | Zustand (persisted) |
| Forms | React Hook Form + Zod |
| HTTP | Axios (with interceptors) |
| Real-time | Socket.io-client |
| Styling | TailwindCSS v4 |
| Animation | Framer Motion |
| Charts | Recharts |

---

## Features

### Authentication
- Register and login with email and password
- JWT-based auth with short-lived access tokens (15 min) and long-lived refresh tokens (7 days)
- Automatic silent token refresh via Axios interceptors — failed requests are queued and retried
- Passwords hashed with bcrypt
- Persistent auth state via Zustand + localStorage

### Communities
- Create public or private communities with a name, description, category, avatar, and banner
- Join and leave communities
- Community member roles: Member, Moderator, Admin
- Browse all communities or view a single community's details and posts

### Posts
- Create text posts with optional image uploads (stored on Cloudinary)
- View a global post feed or a community-specific feed
- Personalized feed showing posts from followed users
- Edit and delete your own posts
- Paginated post listings

### Comments & Replies
- Comment on any post
- Reply to existing comments (nested thread support)
- Edit and delete your own comments

### Likes
- Like and unlike posts
- One like per user per post enforced at the database level

### Saved Posts
- Save posts for later and retrieve them from a dedicated saved section
- Unsave posts at any time

### Follow System
- Follow and unfollow other users
- View a user's followers and following lists

### Real-time Messaging (Socket.io)
- **Private (DM) messages** between individual users
- **Community group messages** visible to all community members
- List of active DM conversations

### Notifications
- Real-time notifications for: likes, comments, replies, and new followers
- Mark individual notifications as read
- Delivered instantly via Socket.io

### User Profiles
- Public profile page with avatar, cover image, and bio
- Profile stats: post count, followers, following
- View any user's posts, followers, and following from their profile
- Update your own avatar, cover image, and bio

### Search
- Search across users, communities, and posts from a single interface

### Admin Dashboard
- Separate admin authentication with a secret key
- Analytics overview (users, posts, communities, comments)
- Full CRUD management for users, posts, communities, and comments
- Role-based access control — admin routes are protected by an admin middleware

---

## Project Structure

```
Community/
├── Backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── src/
│       ├── app.ts                # Express app setup
│       ├── server.ts             # HTTP + Socket.io entry point
│       ├── config/               # Prisma, Cloudinary, Socket config
│       ├── middlewares/          # Auth, admin, error, multer
│       ├── modules/              # Feature modules (MVC)
│       │   ├── auth/
│       │   ├── commuinty/
│       │   ├── posts/
│       │   ├── comment/
│       │   ├── like/
│       │   ├── saved/
│       │   ├── follow/
│       │   ├── message/
│       │   ├── Notification/
│       │   ├── profile/
│       │   ├── search/
│       │   └── admin/
│       └── utils/
│           └── token.ts
└── frontend/
    └── src/
        ├── api/                  # Axios client with interceptors
        ├── app/                  # Next.js App Router pages
        │   ├── (auth)/
        │   ├── (marketing)/
        │   ├── admin/
        │   ├── c/                # Community pages
        │   ├── communities/
        │   ├── messages/
        │   ├── people/
        │   ├── post/
        │   ├── profile/
        │   ├── saved/
        │   └── search/
        ├── components/
        │   ├── features/
        │   ├── marketing/
        │   └── ui/
        ├── hooks/                # useSocket, useNotifications
        ├── providers/            # AuthProvider
        └── store/                # Zustand auth store
```

---

## Database Models

| Model | Key Fields |
|---|---|
| `User` | id, username, email, password, role, avatar, bio, coverImage |
| `Community` | id, name, description, category, avatar, banner, visibility, creatorId |
| `CommunityMember` | userId, communityId, role — unique per pair |
| `Post` | id, title, content, image, authorId, communityId |
| `Comment` | id, content, authorId, postId, parentId (for nested replies) |
| `Like` | userId, postId — unique per pair |
| `SavedPost` | userId, postId — unique per pair |
| `Follow` | followerId, followingId — unique per pair |
| `Notification` | type (LIKE/COMMENT/REPLY/FOLLOW), userId, senderId, postId, isRead |
| `Message` | content, senderId, receiverId (DM) or communityId (group) |

---

## API Overview

| Resource | Base Path |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me` |
| Communities | `GET/POST /api/community`, `POST /api/community/join/:id`, `DELETE /api/community/leave/:id` |
| Posts | `GET/POST /api/post`, `GET /api/post/feed/personalized`, `PATCH/DELETE /api/post/:id` |
| Comments | `POST /api/comment`, `PATCH/DELETE /api/comment/:id` |
| Likes | `POST /api/like`, `DELETE /api/like/:postId` |
| Saved | `GET/POST /api/saved`, `DELETE /api/saved/:postId` |
| Follow | `POST/DELETE /api/follow/:userId` |
| Profile | `GET/PATCH /api/profile`, `GET /api/profile/:userId/posts|followers|following` |
| Messages | `GET /api/message/dm-users`, `POST/GET /api/message/private/:userId`, `POST/GET /api/message/community/:id` |
| Notifications | `GET /api/notification`, `PATCH /api/notification/:id/read` |
| Search | `GET /api/search/users?q=`, `GET /api/search/communities?q=`, `GET /api/search/posts?q=` |
| Admin | `POST /api/admin/auth/signup|login`, `GET /api/admin/analytics`, CRUD for users/posts/communities/comments |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/community
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_SECRET_KEY=your_admin_secret
```

Run Prisma migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

The backend runs on `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

---

## Environment Variables Reference

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port (default 8000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_SECRET_KEY` | Key required to create an admin account |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | Backend Socket.io URL |

---

## License

MIT
