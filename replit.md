# Educational Platform (الأوائل)

## Overview

This is a comprehensive educational platform designed specifically for Sudanese students. The application features a full-stack architecture with React frontend and Express.js backend, implementing role-based access control for students, teachers, and administrators. The platform includes course management, examination systems, a points-based economy, and social features like referrals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with role-based access control

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC flow
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation/update on login
- **Security**: HTTP-only cookies with secure flag in production

### Role-Based Access Control
- **Roles**: student, teacher, institution, parent, admin
- **Dashboard Routing**: Automatic role-based dashboard redirection
- **API Protection**: Middleware for route protection based on user roles
- **UI Adaptation**: Dynamic navigation and features based on user role

### Course Management System
- **Course Creation**: Teachers can create and manage courses
- **Enrollment System**: Students can enroll in courses with points
- **Content Delivery**: Structured course content with progress tracking
- **Pricing**: Points-based course pricing system

### Examination System
- **Question Management**: Multiple choice questions with correct answers
- **Exam Attempts**: Timed examinations with attempt tracking
- **Scoring**: Automatic grading with points rewards
- **Progress Tracking**: Student performance analytics

### Points Economy
- **Wallet System**: Digital wallet for each user with points balance
- **Transactions**: Complete transaction history with types and descriptions
- **Transfers**: Peer-to-peer points transfers between users
- **Earning Mechanisms**: Points earned through exam completion and referrals

### Referral System
- **Unique Codes**: Each user gets a unique referral code
- **Tracking**: Complete referral chain tracking
- **Rewards**: Points-based incentives for successful referrals
- **Analytics**: Referral performance statistics

## Data Flow

### Authentication Flow
1. User clicks login → Redirected to Replit Auth
2. OIDC flow completes → User data synchronized with local database
3. Session created → User redirected to role-appropriate dashboard
4. Subsequent requests → Session validation via middleware

### Course Enrollment Flow
1. Student browses courses → API fetches available courses
2. Student selects course → Points balance verification
3. Enrollment created → Points deducted from wallet
4. Access granted → Course content becomes available

### Examination Flow
1. Student starts exam → Exam attempt created with timestamp
2. Questions loaded → Frontend manages timing and progress
3. Answers submitted → Backend validates and scores
4. Results calculated → Points awarded and attempt recorded

### Points Transaction Flow
1. Action triggers points change → Transaction record created
2. User balance updated → Atomic database operation
3. History logged → Complete audit trail maintained
4. UI updated → Real-time balance reflection

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL hosting
- **Connection Pool**: @neondatabase/serverless for connection management

### Authentication
- **Replit Auth**: OIDC provider for user authentication
- **OpenID Client**: Standard OIDC client implementation

### UI Components
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide Icons**: SVG icon library
- **React Icons**: Additional icon sets (Social media icons)

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety and developer experience
- **ESLint/Prettier**: Code quality and formatting

### Chart Libraries
- **Recharts**: React charting library for admin analytics

## Deployment Strategy

### Development Environment
- **Replit Integration**: Optimized for Replit development environment
- **Hot Reload**: Vite HMR for fast development cycles
- **Environment Variables**: Secure configuration management

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: ESBuild bundles server code for production
- **Static Serving**: Express serves built frontend in production

### Database Management
- **Schema Sync**: Drizzle push for development schema updates
- **Migrations**: Structured migration system for production
- **Connection Pooling**: Efficient database connection management

### Monitoring and Logging
- **Request Logging**: Detailed API request/response logging
- **Error Handling**: Centralized error handling with user-friendly messages
- **Performance Tracking**: Response time monitoring for API endpoints

### Security Considerations
- **Session Security**: Secure session configuration with proper cookies
- **Input Validation**: Zod schemas for API request validation
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **CORS Configuration**: Proper cross-origin request handling