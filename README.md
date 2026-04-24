# Student Team Management Application

A modern, full-stack web application for managing student team members with a clean, minimalist Scandinavian design. Built with React, Node.js, Express, and MongoDB/TiDB, featuring server-side image uploads and a responsive user interface.

## Features

- **Home Page**: Welcome page with team name, introduction, and navigation to main features
- **Add Member Page**: Form to register new team members with profile image upload
- **View Members Page**: Display all team members in a beautiful card layout
- **Member Details Page**: View complete information about individual team members
- **Server-Side Image Upload**: Secure image upload and storage via `/manus-storage/`
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Scandinavian Minimalist Design**: Clean, modern aesthetic with geometric accents

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Node.js, Express 4, tRPC 11
- **Database**: MongoDB/TiDB with Mongoose ORM
- **Image Storage**: S3-compatible storage via `storagePut` (Manus built-in)
- **Testing**: Vitest with comprehensive backend tests
- **Build Tools**: Vite, esbuild
- **Authentication**: Manus OAuth (pre-configured)

## Project Structure

```
student-team-management/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── AddMember.tsx         # Member registration form
│   │   │   ├── ViewMembers.tsx       # Members list view
│   │   │   └── MemberDetails.tsx     # Individual member details
│   │   ├── components/               # Reusable UI components
│   │   ├── lib/
│   │   │   └── trpc.ts              # tRPC client configuration
│   │   ├── App.tsx                  # Main app router
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   └── public/                      # Static assets
├── server/
│   ├── routers.ts                   # tRPC procedure definitions
│   ├── db.ts                        # Database query helpers
│   ├── storage.ts                   # S3 storage helpers
│   ├── members.test.ts              # Backend tests
│   └── _core/                       # Framework internals
├── 
│   ├── schema.ts                    # Database schema
│   └── migrations/                  # Database migrations
├── shared/                          # Shared types and constants
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── README.md                        # This file
```

## Installation

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB/TiDB database
- Environment variables configured

### Setup Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   Create a `.env` file with required variables:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/student_team_management
   JWT_SECRET=your-secret-key
   VITE_APP_ID=your-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   ```

3. **Setup Database**
   ```bash
   No migration is required for MongoDB. Collections are created automatically by Mongoose when data is inserted.
   ```

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`

## API Endpoints

All endpoints are exposed through tRPC at `/api/trpc`.

### Members Management

#### List All Members
- **Procedure**: `members.list`
- **Description**: Fetch all team members
- **Response**: Array of team members with all fields
- **Usage**: Called automatically when viewing the Members page

#### Get Member by ID
- **Procedure**: `members.getById`
- **Input**: `{ id: number }`
- **Description**: Fetch a specific member by their ID
- **Response**: Single member object with all details
- **Usage**: Called when navigating to a member's detail page

#### Create New Member
- **Procedure**: `members.create`
- **Input**:
  ```typescript
  {
    name: string (required)
    rollNumber: string (required)
    year: string (required)
    degree: string (required)
    aboutProject?: string
    hobbies?: string
    certificate?: string
    internship?: string
    aboutYourAim?: string
    imageBase64?: string (base64 encoded image)
    imageName?: string
    imageMimeType?: string (image/jpeg, image/png, image/webp)
  }
  ```
- **Description**: Create a new team member with optional profile image
- **Response**: Created member object with ID and image URL

**Image Upload Requirements**:
- Maximum file size: 5MB
- Supported formats: JPEG, PNG, WebP
- Images are stored server-side and served via `/manus-storage/` path
- Upload is handled via base64 encoding in the form submission
- Validation occurs on both client and server side

## Database Schema

### team_members Table

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INT | No | Primary key, auto-increment |
| name | VARCHAR(255) | No | Member's full name |
| rollNumber | VARCHAR(50) | No | Roll number or ID |
| year | VARCHAR(50) | No | Academic year |
| degree | VARCHAR(255) | No | Degree program |
| aboutProject | TEXT | Yes | Project involvement details |
| hobbies | TEXT | Yes | Hobbies and interests |
| certificate | TEXT | Yes | Certifications |
| internship | TEXT | Yes | Internship experience |
| aboutYourAim | TEXT | Yes | Goals and aspirations |
| imageUrl | VARCHAR(500) | Yes | URL to profile image |
| createdAt | TIMESTAMP | No | Creation timestamp |
| updatedAt | TIMESTAMP | No | Last update timestamp |

## Running Tests

Execute the test suite to verify backend functionality:

```bash
pnpm test
```

**Test Coverage**:
- Members list retrieval
- Member creation with validation
- Image upload handling
- Error scenarios (invalid MIME type, missing fields)
- Integration tests (create and retrieve)

## Design System

### Color Palette

- **Background**: Pale cool gray (`oklch(0.96 0.001 65)`)
- **Foreground**: Deep charcoal (`oklch(0.15 0.01 65)`)
- **Accent Blue**: Soft pastel blue (`oklch(0.85 0.08 250)`)
- **Accent Pink**: Soft blush pink (decorative)
- **Border**: Light gray (`oklch(0.9 0.002 65)`)

### Typography

- **Font Family**: Inter (100, 300, 400, 500, 600, 700, 900 weights)
- **Headings**: Bold, black sans-serif (font-weight: 900)
- **Subtitles**: Thin, delicate (font-weight: 100)
- **Body**: Regular weight (400)

### Design Features

- Minimalist Scandinavian aesthetic
- Generous negative space
- Geometric decorative shapes
- Responsive grid layouts
- Smooth transitions and hover effects

## Building for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

The application will be optimized and ready for deployment.

## Troubleshooting

### Database Connection Issues
- Verify `MONGODB_URI` is correctly configured and MongoDB is running
- Ensure MongoDB/TiDB server is running
- Check network connectivity to database host

### Image Upload Failures
- Verify file size is under 5MB
- Confirm image format is JPEG, PNG, or WebP
- Check S3 storage credentials are configured

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Clear build cache: `rm -rf dist .vite`
- Verify Node.js version is 18+

## Contributing

When adding new features:
1. Update the database schema in `schema.ts`
2. Generate and apply migrations
3. Add tRPC procedures in `server/routers.ts`
4. Create corresponding frontend pages in `client/src/pages/`
5. Write tests in `server/*.test.ts`
6. Update this README with new endpoints

## License

MIT

## Support

For issues or questions, please refer to the project documentation or contact the development team.
