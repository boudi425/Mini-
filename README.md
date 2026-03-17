# Mini Social App

Production-style mini social app with JWT auth, follow system, Redis caching/blacklist, and Socket.IO real-time chat.

## Project Structure

- `backend/`: Express + MySQL + Redis + Socket.IO API
- `frontend/`: React + Vite client app

## Features

- JWT auth (access + refresh tokens)
- HTTP-only refresh token cookie
- Logout token blacklisting in Redis (`blacklist:<token>`)
- User discovery (cached in Redis for 60s)
- Follow / unfollow with optimistic UI
- Real-time chat with message persistence in MySQL
- Socket auth via JWT and user-specific room (`user:<id>`)
- Bonus: typing indicator and online user tracking set (`online_users`)

## Quick Start

### 1) Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

Create database tables:

```bash
mysql -u root -p < sql/schema.sql
```

Run backend:

```bash
npm run dev
```

### 2) Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users`
- `POST /api/follow/:id`
- `DELETE /api/follow/:id`
- `GET /api/messages/:userId`
- `POST /api/messages`

## Security Notes

- Passwords hashed with bcrypt
- Private routes use JWT auth middleware
- Blacklisted tokens are blocked at middleware + socket layer
- CORS configured to allow only client origin
- Uses environment variables for secrets and connection strings
