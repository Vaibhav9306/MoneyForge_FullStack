# MoneyForge AI - Full Stack Integration Guide

## Project Overview

This is a complete full-stack application integrating:
- **Frontend**: React + Vite + React Router + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + JWT Authentication
- **Landing Page**: Professional marketing landing page
- **Authentication**: Complete login/signup flow with JWT tokens
- **Dashboard**: Multi-layered financial application

## Architecture

### Frontend Structure
```
src/
├── pages/
│   ├── Landing/
│   │   └── LandingPage.tsx       # Marketing landing page
│   ├── Auth/
│   │   └── AuthPage.tsx          # Login & Signup forms
│   └── Dashboard/
│       └── DashboardPage.tsx     # Main app (protected)
├── routes/
│   ├── index.ts                  # Route configuration
│   └── ProtectedRoute.tsx        # Auth guard for private routes
├── context/
│   ├── AuthContext.tsx           # Auth state management
│   └── IdeaContext.tsx           # App state management
├── components/                   # Existing UI components
├── services/
│   └── api.ts                    # Axios instance with JWT interceptor
└── main.tsx                      # App entry point with routing
```

### Routes
| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | LandingPage | No | Marketing landing page |
| `/login` | AuthPage | No | Login form (redirects to dashboard if logged in) |
| `/signup` | AuthPage | No | Signup form (redirects to dashboard if logged in) |
| `/dashboard` | DashboardPage | Yes | Protected dashboard with all features |

## Setup & Installation

### Prerequisites
- Node.js 18+ (recommended 20+)
- MongoDB (local or MongoDB Atlas connection)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd "BACKEND 2.0/backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env` already set up)
   ```
   MONGO_URI="mongodb+srv://..."
   JWT_SECRET="vaibhavsharma123"
   PORT=8000
   OPENROUTER_API_KEY="sk-or-v1-..."
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Server will run on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd "FRONTEND 2.0"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install react-router-dom and all required packages.

3. **Environment is already configured** (`.env`)
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

## Authentication Flow

### User Journey
1. **New User**: Landing Page → Sign Up → Verify Credentials → Dashboard
2. **Returning User**: Landing Page → Sign In → Dashboard
3. **Auto-Login**: If valid JWT exists in localStorage, auto-logged in on page load
4. **Protected Routes**: Unauthenticated users redirected to /login

### API Endpoints
- **Register**: `POST /api/auth/register`
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```
  Response:
  ```json
  {
    "msg": "User registered successfully",
    "token": "eyJhbGc...",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
  ```

- **Login**: `POST /api/auth/login`
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```
  Response:
  ```json
  {
    "msg": "Login success",
    "token": "eyJhbGc...",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
  ```

### Token Management
- **Storage**: JWT stored in `localStorage` as `moneyforge_token`
- **Persistence**: Automatically attached to all API requests via axios interceptor
- **Expiration**: 1 day (configurable in backend)
- **Logout**: Token cleared from localStorage and user state reset

## Features Implemented

### Landing Page
✅ Hero section with call-to-action buttons
✅ Features showcase (AI Guidance, Growth Tracking, Security)
✅ How It Works section with 3-step process
✅ Social proof (10K+ users, $2B+ wealth tracked)
✅ Responsive design for all devices
✅ Motion animations and transitions
✅ Auto-redirect to dashboard if already logged in

### Authentication
✅ Professional login/signup forms
✅ Floating label input fields
✅ Real-time form validation
✅ Password strength indicator (signup only)
✅ Error message handling
✅ Loading states during submission
✅ Mode toggle (login ↔ signup)
✅ Automatic route-based mode detection
✅ Auto-redirect if already authenticated

### Dashboard
✅ Protected route with auth guard
✅ Sidebar navigation with layer switching
✅ Header with user info and controls
✅ Multiple functional layers:
  - Dashboard (overview)
  - Idea (startup concepts)
  - Execution (implementation)
  - Finance (money management)
  - Growth (marketing & scaling)
  - Wealth (investment tracking)
  - Budget (financial planning)
  - Tools (utilities)
  - Profile (user settings)
  - Landing (marketing pages)

## Development Workflow

### Making Changes
1. Frontend changes are hot-reloaded by Vite
2. Backend changes require server restart (`npm run dev`)
3. Both dev servers run simultaneously in separate terminals

### Building For Production
```bash
# Frontend
npm run build      # Creates dist/ folder
npm run preview    # Preview optimized build locally

# Backend
npm run start      # Start with node instead of nodemon
```

## Testing the Full Flow

### Test Signup
1. Visit `http://localhost:5173`
2. Click "Get Started Now" or navigate to `/signup`
3. Fill in form with:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPass123!"
   - Confirm Password: "TestPass123!"
4. Click "Create Account"
5. Should redirect to dashboard

### Test Login
1. Visit `http://localhost:5173/login`
2. Use credentials from signup above
3. Click "Sign In"
4. Should redirect to dashboard

### Test Auto-Login
1. Close browser or logout
2. Visit `http://localhost:5173`
3. Should auto-login if token is valid in localStorage

### Test Protected Route
1. Open browser dev tools → Application → Local Storage
2. Delete `moneyforge_token`
3. Navigate directly to `/dashboard`
4. Should redirect to `/login`

## Deployment Considerations

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Set environment variable: `VITE_API_BASE_URL=<your-api-url>`
3. Deploy dist/ folder

### Backend (Heroku/Railway/EC2)
1. Set environment variables in hosting platform
2. Deploy with `npm run start`
3. Update CORS origins with production frontend URL

### MongoDB
- Ensure MongoDB connection string is secure
- Use environment variables, never hardcode credentials
- Consider database backups and scalability

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error
- Verify `MONGO_URI` in backend `.env`
- Check network connectivity for MongoDB Atlas
- Ensure IP whitelist is configured (if using cloud MongoDB)

### CORS Errors
- Verify frontend URL is in backend CORS whitelist
- Default: `http://localhost:5173` and `http://localhost:4173`
- Update in `BACKEND 2.0/backend/server.js` if needed

### Authentication Not Working
- Check `VITE_API_BASE_URL` matches backend URL
- Verify JWT_SECRET matches between frontend and backend
- Check token is being stored in localStorage
- Verify Authorization header format: `Bearer <token>`

## Performance Tips

1. **Lazy Load Components**: Use React.lazy() for dashboard layers
2. **Image Optimization**: Optimize landing page images
3. **API Caching**: Implement request caching for user profile
4. **Database Indexing**: Add indexes on email field in MongoDB
5. **Rate Limiting**: Implement rate limiting on auth endpoints

## Security Checklist

- ✅ JWT tokens stored securely in localStorage
- ✅ HTTPS enforced in production (use with Vercel/Netlify)
- ✅ CORS configured to allow only trusted origins
- ✅ Password validation enforced (8+ chars recommended)
- ✅ MongoDB using authenticated connections
- ✅ Environment variables for sensitive data
- ⚠️ TODO: Add email verification for new accounts
- ⚠️ TODO: Implement rate limiting on auth endpoints
- ⚠️ TODO: Add password reset functionality
- ⚠️ TODO: Implement refresh token rotation

## Support & Documentation

For more information:
- React Router: https://reactrouter.com/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
