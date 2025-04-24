# EduLearn - Online Education Platform

A modern, comprehensive online learning platform built with Next.js and React, designed for students, teachers, and administrators to facilitate seamless educational experiences.

![EduLearn Platform](https://via.placeholder.com/800x400?text=EduLearn+Platform)

## 🚀 Features

### For Students

- Access to a wide range of courses, quizzes, and learning materials
- Interactive learning dashboards
- Personal profile management
- Course enrollment and progress tracking
- Quiz attempts with instant feedback
- Learning history tracking

### For Teachers

- Course creation and management
- Quiz and assessment creation tools
- Student progress monitoring
- Learning materials upload (books, documents, videos)
- Interactive classroom features

### For Administrators

- User management system
- Platform analytics dashboard
- Content moderation and approval workflows
- System-wide announcements
- User role and permission management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query, React Hook Form
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (recommended)
- **Additional Libraries**:
  - Radix UI components
  - Zod for validation
  - Recharts for data visualization
  - Next Themes for dark/light mode

## 📁 Project Structure

```
education-platform/
├── app/                # Next.js App Router pages
│   ├── admin/          # Admin dashboard and management pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── blog/           # Blog pages
│   ├── books/          # Book repository pages
│   ├── courses/        # Course listings and detail pages
│   ├── dashboard/      # User dashboards
│   ├── learn/          # Learning environment
│   ├── profile/        # User profile pages
│   ├── quizzes/        # Quiz pages
│   ├── settings/       # User settings
│   ├── teacher/        # Teacher-specific pages
│   └── ...             # Other pages
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── public/             # Static assets
└── styles/             # Global styles
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (preferred) or npm
- MongoDB instance

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/education-platform.git
   cd education-platform
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MONGODB_URI=your-mongodb-connection-string
   # Add other required environment variables
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛣️ Roadmap

- Advanced analytics for learning patterns
- AI-powered learning recommendations
- Integrated video conferencing
- Mobile application
- Offline mode for learning materials
- Integration with popular LMS platforms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Maintainer - your.email@example.com

Project Link: [https://github.com/your-username/education-platform](https://github.com/your-username/education-platform)
