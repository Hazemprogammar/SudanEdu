# Al-Awael Educational Platform (منصة الأوائل التعليمية)

A comprehensive Arabic-first educational platform designed specifically for Sudanese students, featuring multi-role dashboards, course management, examination systems, and a points-based economy.

## 🌟 Features

### Multi-Role System
- **Student Dashboard**: Course enrollment, exam taking, wallet management, referral system
- **Teacher Dashboard**: Course creation, student management, exam creation, analytics
- **Admin Dashboard**: User management, platform analytics, complaint handling, system settings
- **Institution & Parent Roles**: Specialized dashboards for educational institutions and parents

### Educational Features
- **Course Management**: Create, manage, and enroll in courses with detailed content
- **Examination System**: Timed exams with automatic scoring and progress tracking
- **Question Bank**: Multiple choice questions with correct answer validation
- **Progress Tracking**: Detailed analytics for student performance

### Points Economy
- **Digital Wallet**: Points-based system (1000 points = 99 SDG)
- **Transactions**: Complete transaction history and peer-to-peer transfers
- **Earning Mechanisms**: Points earned through exam completion and referrals
- **Purchase System**: Use points to enroll in premium courses

### Social Features
- **Referral System**: Unique referral codes with bonus rewards
- **Reviews & Ratings**: Course feedback and rating system
- **Complaints Management**: Structured complaint handling system
- **Notifications**: Real-time notifications for activities and updates

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom RTL Arabic styling
- **shadcn/ui** components built on Radix UI primitives
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **Replit Auth** with OpenID Connect
- **PostgreSQL** via Neon serverless
- **Drizzle ORM** for type-safe database operations
- **Express sessions** with PostgreSQL storage

### Database
- **PostgreSQL** (Neon serverless)
- **Drizzle ORM** for schema management
- **Session storage** in PostgreSQL
- **Automated migrations** via Drizzle Kit

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Replit environment (for authentication)

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
DATABASE_URL
postgresql://neondb_owner:npg_IHGSmgVOZ31M@ep-noisy-violet-a2g05ruk.eu-central-1.aws.neon.tech/neondb?sslmode=require

PGDATABASE(neondb)
PGHOST(ep-noisy-violet-a2g05ruk.eu-central-1.aws.neon.tech) 
PGPORT(5432) 
PGUSER(neondb_owner) 
PGPASSWORD(npg_IHGSmgVOZ31M

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📊 Database Schema

The platform uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User profiles with role-based access
- **courses**: Course information and content
- **exams**: Examination details and configurations
- **questions**: Question bank for exams
- **exam_attempts**: Student exam attempts and scores
- **points_transactions**: Points economy transactions
- **referrals**: Referral system tracking
- **reviews**: Course reviews and ratings
- **complaints**: Complaint management system
- **notifications**: Real-time notification system
- **enrollments**: Course enrollment tracking

## 🎨 UI/UX Design

### Arabic-First Design
- **RTL Layout**: Complete right-to-left interface design
- **Arabic Typography**: Cairo and Tajawal fonts optimized for Arabic text
- **Cultural Colors**: Educational color scheme with blue and gray tones
- **Responsive Design**: Mobile-first approach with desktop optimization

### Accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color combinations
- **Font Sizing**: Scalable text for better readability

## 🔐 Authentication & Security

### Replit Authentication
- **OpenID Connect**: Secure authentication via Replit
- **Session Management**: PostgreSQL-backed sessions
- **Role-Based Access**: Fine-grained permission system
- **CSRF Protection**: Built-in request validation

### Data Security
- **Input Validation**: Zod schemas for all API requests
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **Secure Headers**: Express security middleware
- **Environment Isolation**: Secure environment variable handling

## 📱 API Documentation

### Authentication Endpoints
- `GET /api/auth/user` - Get current user information
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout and clear session

### Course Management
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course (Teacher/Admin)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Examination System
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/attempt` - Start exam attempt
- `PATCH /api/exam-attempts/:id` - Submit exam answers

### Points & Wallet
- `GET /api/wallet/balance` - Get user points balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/transfer` - Transfer points between users

### Admin Functions
- `GET /api/admin/users` - List all users (Admin only)
- `POST /api/admin/users/promote` - Promote user role (Admin only)
- `GET /api/admin/dashboard` - Get admin analytics

## 🔄 Development Workflow

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

### Database Management
- **Drizzle Kit**: Schema migrations
- **Type Safety**: Fully typed database operations
- **Seed Data**: Development data seeding scripts

### Deployment
- **Environment Management**: Secure configuration handling
- **Performance Optimization**: Build optimizations for production

## 👥 Contributing

We welcome contributions to the Al-Awael platform! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Ensure Arabic text is properly handled
- Test RTL layout compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Email: hazembabiker2004@gmail.com

## 🙏 Acknowledgments

- Built for Sudanese students and educators
- Designed with Arabic-first principles
- Powered by Hazem Babiker 

---

**منصة الأوائل التعليمية - تعليم متقدم للطلاب السودانيين**

*Al-Awael Educational Platform - Advanced Learning for Sudanese Students*