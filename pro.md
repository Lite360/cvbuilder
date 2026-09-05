Yes. This is a strong foundation for the CV Builder mobile app. I would keep this architecture and tighten a few decisions before development.

Final product direction

App: CV Builder
Platform: Android/iOS
Frontend: React Native + Expo + TypeScript
Backend: Core PHP REST API
Database: MySQL
PDF: Server-side HTML/CSS → PDF
Storage: S3-compatible storage or Cloudinary
Payments: Paystack/Korapay
AI: LLM API for assisted writing
Admin: Separate admin authentication and admins table

Core architecture
React Native + Expo
        │
        │ HTTPS REST API
        ▼
    Core PHP API
        │
   ┌────┼──────────────┐
   ▼    ▼              ▼
 MySQL Storage       Services
                  ├── AI
                  ├── Payments
                  └── PDF
                         │
                         ▼
                   HTML/CSS CV
                         │
                         ▼
                        PDF
Important decisions
CVs remain data-driven, never stored as one giant document.
Templates are separate from CV data.
Education, experience, projects, skills, etc. are normalized into their own tables.
Admin accounts remain completely separate from normal users.
Paid templates are unlocked only after server-side payment verification/webhook confirmation.
PDF generation happens on the backend, giving you much better control over A4 formatting.
React Native handles the app experience, while PHP handles business logic and sensitive operations.
Security should be built in from the start: rate limiting, Argon2id password hashing, secure sessions/tokens, environment variables for secrets, input validation, SQL injection prevention, HTTPS, CORS configuration, and security headers.
MVP scope

I would make the first release:

Authentication

Register
Login
Logout
Forgot/reset password

CV Builder

Personal information
Professional summary
Education
Work experience
Skills
Projects
Certifications
Reordering sections/items

Templates

3 free templates
2 premium templates
Template preview
Change template without rebuilding CV

Preview

Live preview
A4 layout
Multi-page support

Export

Generate PDF
Download
Native share

Payments

Paystack/Korapay
Premium template purchase
Server-side verification
Purchase history

Admin

Separate /admin access
Separate admins table
User management
CV management
Template management
Payment management
Dashboard/statistics
Phase 2

After the MVP works properly, add:

AI CV writing
AI professional summary
AI experience rewriting
Cover letters
Job-description CV optimization
More templates
Custom section ordering
Multiple CV versions
Google/Apple authentication
Resume scoring
Job application tracking

One thing I would not put into the first MVP is subscriptions. Start with one-time premium template purchases. It keeps the payment and entitlement system much simpler.

This gives us a clean product that can later grow into a full career application without having to rewrite the underlying CV architecture.

Just react native + Expo + typescript full stack vercel neon blob 

Yes. If you want the entire project simplified to React Native + Expo + TypeScript, with Vercel + Neon + Blob, I would change the architecture to this:

Final Stack
React Native
Expo
TypeScript
Expo Router
        │
        ▼
Vercel
TypeScript API / Serverless Functions
        │
   ┌────┴──────────────┐
   ▼                   ▼
Neon PostgreSQL     Vercel Blob
Database            File Storage
   │
   ├── Users
   ├── CVs
   ├── Education
   ├── Experience
   ├── Skills
   ├── Projects
   ├── Certifications
   ├── Templates
   ├── Purchases
   └── Admins
Frontend
React Native
Expo
TypeScript
Expo Router
NativeWind or standard StyleSheet
Expo SecureStore for authentication tokens
Expo ImagePicker for profile photos
Expo Sharing for PDF sharing
Backend

Use TypeScript on Vercel rather than PHP.

/api
├── auth
├── users
├── cvs
├── education
├── experience
├── skills
├── projects
├── certifications
├── templates
├── payments
├── pdf
├── ai
└── admin

The backend can be built with Vercel's TypeScript serverless functions/API routes.

Database

Neon PostgreSQL

Core tables:

users
admins
cvs
cv_profiles
educations
experiences
skills
projects
certifications
templates
purchases
payments
refresh_tokens

And importantly:

admins

stays completely separate from:

users

with its own admin authentication and /admin API area.

Storage

Vercel Blob for:

Profile photos
Template preview images
Generated PDF files
Other user-uploaded CV assets
React Native
     ↓
Vercel API
     ↓
Vercel Blob

Don't expose Blob credentials in the Expo application. Upload through authenticated server-side endpoints or signed upload mechanisms.

PDF generation

The flow becomes:

React Native
      ↓
POST /api/cvs/:id/pdf
      ↓
Vercel
      ↓
Load CV data from Neon
      ↓
Render selected TypeScript template
      ↓
Generate A4 PDF
      ↓
Store PDF in Vercel Blob
      ↓
Return secure file URL
      ↓
Expo
      ↓
Share / Save
One important consideration

For the PDF engine, I would test the Vercel runtime against the specific PDF library we choose. Serverless environments can have limitations with browser binaries and native dependencies.

If we want maximum compatibility, we can use a browser-based HTML/CSS PDF renderer compatible with Vercel, rather than designing the PDF directly inside React Native.

Final technology choice
Layer	Technology
Mobile	React Native
Framework	Expo
Language	TypeScript
Navigation	Expo Router
API	TypeScript
Hosting/API	Vercel
Database	Neon PostgreSQL
Storage	Vercel Blob
Authentication	Custom TypeScript auth
Password hashing	Argon2id
PDF	Server-side HTML/CSS → PDF
Payments	Paystack/Korapay
AI	LLM API
Icons	Font Awesome
Admin	Separate admin system

So yes, no PHP, no Laravel, no separate backend server.

The project is essentially React Native + Expo + TypeScript full-stack, with Vercel acting as the application/API backend, Neon as the database, and Blob as storage.

Full prompt mvp epr prd .git

Absolutely. Below is the complete project specification for the CV Builder mobile application, using only React Native + Expo + TypeScript, with Vercel + Neon + Vercel Blob.

1. FULL BUILD PROMPT

Build a production-ready mobile CV/Resume Builder application using React Native, Expo, and TypeScript.

The application must be a real mobile app for Android and iOS, not a website wrapped inside a mobile shell.

PRODUCT

Build a professional CV/Resume Builder that allows users to:

Create an account
Create multiple CVs
Enter CV information through structured sections
Choose professional CV templates
Preview their CV
Edit and rearrange CV sections
Generate an A4 PDF
Save and share the PDF
Purchase premium templates
Use AI-assisted writing features where enabled

The architecture must be data-driven. Never store a CV as one giant HTML document.

CV data must be stored in structured database records and rendered through templates.

TECHNOLOGY

Frontend:

React Native
Expo
TypeScript
Expo Router
React Native components
NativeWind or clean StyleSheet-based styling
Font Awesome icons

Backend:

TypeScript
Vercel
Vercel serverless/API functions

Database:

Neon PostgreSQL

Storage:

Vercel Blob

Authentication:

Secure token-based authentication
Argon2id password hashing
Secure token/session handling
Password reset
Email verification where implemented

Payments:

Paystack or Korapay
Server-side payment verification
Webhook processing

PDF:

Server-side HTML/CSS CV rendering
A4 PDF generation
Store generated PDFs in Vercel Blob

AI:

LLM API through server-side Vercel functions
Never expose AI API keys in the mobile application
DESIGN DIRECTION

The application should look like a mature professional career/productivity application.

Avoid:

Generic AI-generated UI
Excessive gradients
Excessive glassmorphism
Huge decorative elements
Flashy animations
Unnecessary cards everywhere
Overly colorful interfaces

Use:

Clean typography
Strong spacing system
Professional white/light surfaces
Restrained accent color
Clear hierarchy
Accessible contrast
Consistent buttons
Font Awesome icons
Smooth but subtle transitions

The CV templates themselves can have different visual identities, but the main application UI should remain consistent.

APP NAVIGATION

Use Expo Router.

Main routes:

/(auth)
/(auth)/login
/(auth)/register
/(auth)/forgot-password
/(auth)/reset-password

/(tabs)
/(tabs)/index
/(tabs)/cvs
/(tabs)/templates
/(tabs)/profile

/cv/create
/cv/[id]/personal
/cv/[id]/summary
/cv/[id]/education
/cv/[id]/experience
/cv/[id]/skills
/cv/[id]/projects
/cv/[id]/certifications
/cv/[id]/preview
/cv/[id]/templates

/payment/[id]

/settings

Admin API/application access must remain completely separate from normal user access.

ONBOARDING

Show a short introduction explaining:

Create a professional CV
Choose a professional template
Export your CV as PDF

Then ask:

What are you creating?

Options:

Professional CV
Student CV
Academic CV
Resume

The selected type should be stored against the CV.

AUTHENTICATION

Implement:

Registration
Login
Logout
Forgot password
Reset password
Email verification if email infrastructure is configured
Secure authentication state
Session/token expiration
Secure token storage

Never store plaintext passwords.

Use Argon2id for password hashing.

Apply rate limiting to authentication endpoints.

USER DASHBOARD

Display:

Greeting
Number of CVs
Recent CVs
Create New CV button

Example:

Good evening

My CVs

Software Developer CV
Updated recently

Data Analyst CV
Updated recently

[+ Create New CV]

Users must be able to create multiple CVs.

CV CREATION

When creating a CV, ask for:

CV title
CV type
Initial template

Then create the structured CV record.

PERSONAL INFORMATION

Fields:

Full name
Professional title
Email
Phone
Location
LinkedIn
Portfolio/website
Profile photo
Professional summary

Allow profile photo upload through Vercel Blob.

Validate all fields.

EDUCATION

Allow multiple education records.

Fields:

Institution
Degree
Field of study
Start date
End date
Grade
Description

Allow:

Add
Edit
Delete
Reorder
EXPERIENCE

Allow multiple experience records.

Fields:

Company
Job title
Location
Start date
End date
Current position
Description

Allow multiple bullet points in descriptions.

Allow:

Add
Edit
Delete
Reorder
SKILLS

Allow users to:

Search predefined skills
Select skills
Add custom skills
Set proficiency level
Reorder skills

Example proficiency:

Beginner
Intermediate
Advanced
Expert

PROJECTS

Fields:

Project name
Description
Technologies
Project URL

Allow multiple projects.

CERTIFICATIONS

Fields:

Certification name
Issuing organization
Issue date
Expiration date
Credential ID
Credential URL

Allow multiple certifications.

FUTURE SECTIONS

Design the database and CV renderer so additional sections can be added later:

References
Languages
Awards
Publications
Volunteer experience
Interests
Courses
Achievements

These do not have to be part of the first MVP.

CV TEMPLATE SYSTEM

Templates must be independent from CV data.

Architecture:

CV DATA
↓
TEMPLATE ENGINE
↓
SELECTED TEMPLATE
↓
PREVIEW
↓
PDF

Create at least:

Free:

Classic
Simple
Professional

Premium:

Executive
Modern

Every template must consume the same CV data structure.

Do not duplicate CV information for individual templates.

Templates must contain:

Name
Slug
Description
Preview image
Template configuration
Premium status
Price
Active status
TEMPLATE PREVIEW

Users should be able to:

Browse templates
Preview a template
Select template
Change template
See premium/free status

Changing templates must never modify the underlying CV data.

LIVE CV PREVIEW

Create a professional A4 preview.

The preview must update when CV information changes.

Display:

Header
Personal information
Summary
Experience
Education
Skills
Projects
Certifications

Support multiple pages.

Prevent sections from being unnecessarily split.

PDF GENERATION

Generate the final PDF on the server.

Process:

Mobile App
↓
Authenticated API
↓
Retrieve CV
↓
Retrieve template
↓
Render HTML/CSS
↓
Generate A4 PDF
↓
Upload PDF to Vercel Blob
↓
Return file reference
↓
Mobile App
↓
Share/save

Requirements:

A4 dimensions
Professional margins
Correct page breaks
Multiple pages
Embedded fonts where supported
High-resolution profile image
Clickable URLs where supported
Consistent spacing
No overlapping content
No broken sections
No accidental blank pages
PAYMENTS

Premium templates can be purchased individually.

Example:

Executive Template
₦2,000

[Unlock Template]

Payment:

User selects template
↓
Create payment transaction through API
↓
Payment provider checkout
↓
Provider callback/webhook
↓
Server verifies transaction
↓
Create purchase record
↓
Unlock template

Never trust the frontend payment response.

Premium access must only be granted after server-side verification.

AI FEATURES

AI functionality must be optional and server-side.

Features:

Professionalize summary
Rewrite experience
Improve wording
Shorten content
Generate professional descriptions

Example:

User:
"I built websites for clients."

AI:
"Developed responsive websites for clients using modern web technologies, focusing on usability, performance, and maintainability."

The AI must not invent:

Jobs
Degrees
Certifications
Companies
Skills
Achievements

AI output must be based on information provided by the user.

ADMIN SYSTEM

Create a completely separate administration system.

Do not place administrators in the normal users table.

Database:

admins

Admin authentication must be separate.

Admin API namespace:

/api/admin/...

Admin interface:

/admin

Admin dashboard:

Total users
Total CVs
PDFs generated
Premium purchases
Revenue

Admin management:

Users:

Search
View
Block
Unblock
Delete where appropriate
View CVs

Templates:

Create
Edit
Delete/deactivate
Upload preview image
Set free/premium
Set price
Activate/deactivate

Payments:

View transactions
View purchases
Payment status
Transaction reference

CV management:

View CVs
User ownership
Creation date
Template
DATABASE

Use Neon PostgreSQL.

Core tables:

users
admins
cvs
cv_profiles
educations
experiences
skills
cv_skills
projects
certifications
templates
purchases
payments
sessions/tokens
password_resets

Relationships must use foreign keys.

Every user-owned record must be properly associated with its owner.

Use indexes for frequently queried fields.

Use timestamps.

Use UUIDs where appropriate.

SECURITY

Implement:

Argon2id password hashing
Rate limiting
HTTPS in production
Secure authentication tokens
Token expiration
Secure token storage
Input validation
Output validation
SQL injection prevention
Parameterized database queries
Proper CORS configuration
Security headers
Authorization checks
Ownership checks
File upload validation
File size limits
Secure Blob access
Payment webhook verification
AI API key protection
Environment variables for secrets
No sensitive credentials in source code
Error messages that do not expose internal details

A user must never be able to access another user's CV by changing an ID in an API request.

Admin endpoints must require admin authorization.

API

Create clean REST endpoints.

Authentication:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

CV:

GET /api/cvs
POST /api/cvs
GET /api/cvs/
PATCH /api/cvs/
DELETE /api/cvs/

Profile:

GET /api/cvs//profile
PUT /api/cvs//profile

Education:

GET /api/cvs//education
POST /api/cvs//education
PATCH /api/education/
DELETE /api/education/

Experience:

GET /api/cvs//experience
POST /api/cvs//experience
PATCH /api/experience/
DELETE /api/experience/

Skills:

GET /api/cvs//skills
POST /api/cvs//skills
DELETE /api/cvs//skills/

Projects:

GET /api/cvs//projects
POST /api/cvs//projects
PATCH /api/projects/
DELETE /api/projects/

Certifications:

GET /api/cvs//certifications
POST /api/cvs//certifications
PATCH /api/certifications/
DELETE /api/certifications/

Templates:

GET /api/templates
GET /api/templates/

PDF:

POST /api/cvs//pdf

Payments:

POST /api/payments/create
GET /api/payments/
POST /api/payments/webhook

AI:

POST /api/ai/summary
POST /api/ai/experience

FILE STRUCTURE

Use a monorepo-style structure:

/app
/components
/features
/hooks
/lib
/services
/types
/constants
/assets

/server
/api
/lib
/services
/auth
/pdf
/ai
/payments
/admin

/db
/schema
/migrations

/templates

/public

.env.example

README.md

ENVIRONMENT VARIABLES

Use environment variables for:

DATABASE_URL
AUTH_SECRET
BLOB_READ_WRITE_TOKEN
PAYMENT_SECRET_KEY
PAYMENT_PUBLIC_KEY
PAYMENT_WEBHOOK_SECRET
AI_API_KEY

Never commit actual credentials.

ERROR HANDLING

Create consistent API responses.

Success:

{
"success": true,
"data": {}
}

Error:

{
"success": false,
"message": "Something went wrong"
}

Do not expose stack traces to users.

PERFORMANCE
Minimize unnecessary API requests
Cache appropriate template data
Use optimistic updates where appropriate
Compress uploaded images
Lazy-load templates
Paginate large admin lists
Index database queries
Avoid loading an entire CV unnecessarily
Cache generated PDFs where appropriate
UX

The user should always know:

Which CV they are editing
Which section they are editing
What remains incomplete
Whether changes have been saved
Whether a template is free or premium

Show progress during CV creation.

Allow users to return to previous sections.

Do not force users to complete every section before previewing.

MVP

The first production version must include:

Authentication
CV creation
Multiple CVs
Personal information
Summary
Education
Experience
Skills
Projects
Certifications
3 free templates
2 premium templates
Template switching
Live preview
A4 PDF export
PDF sharing
Premium template payment
Separate admin system
Admin template management
Admin user management
Admin payment management
Basic dashboard

Do not build advanced AI optimization, cover letters, job matching, or subscriptions into the first release unless specifically requested.

DEVELOPMENT STANDARD

Write clean, maintainable TypeScript.

Use reusable components.

Keep business logic outside UI components.

Use typed API responses.

Use proper validation.

Do not use hardcoded secrets.

Do not duplicate CV data across templates.

Do not create unnecessary dependencies.

The finished project must be deployable to:

Expo/EAS for mobile
Vercel for backend/API
Neon for PostgreSQL
Vercel Blob for storage

Provide setup documentation and environment variable instructions.

2. MVP
MVP objective

Allow a user to go from zero CV → professional PDF CV with the minimum number of steps.

Register
   ↓
Create CV
   ↓
Personal Information
   ↓
Education
   ↓
Experience
   ↓
Skills
   ↓
Projects
   ↓
Certifications
   ↓
Choose Template
   ↓
Preview
   ↓
Generate PDF
   ↓
Share
MVP features
Module	MVP
Registration	✅
Login	✅
Password reset	✅
Multiple CVs	✅
Personal information	✅
Summary	✅
Education	✅
Experience	✅
Skills	✅
Projects	✅
Certifications	✅
Templates	✅
Free templates	3
Premium templates	2
Live preview	✅
A4 PDF	✅
PDF sharing	✅
Payments	✅
Admin	✅
AI writing	Optional/Phase 2
Cover letters	❌
Job matching	❌
CV optimization	❌
Subscriptions	❌
3. PRD
Product name

CV Builder

Working alternatives:

CVForge
CVCraft
CareerCV
MyCV
ResumePro
Problem

Creating a professional CV is difficult for many users because they need to understand formatting, document design, section organization, and professional wording.

Users should be able to enter their information once and automatically produce a professionally formatted CV.

Target users
Students
Graduates
Job seekers
Developers
Professionals
Freelancers
Career changers
Product goal

Make professional CV creation simple enough that a user can create and export a polished CV from a mobile phone.

Core value proposition

Enter your information once. Choose a professional design. Get your CV.

Functional requirements
FR-01 Authentication

Users can create accounts and securely authenticate.

FR-02 CV management

Users can create, edit, duplicate, rename and delete CVs.

FR-03 Structured information

CV information must be stored in separate structured entities.

FR-04 Template engine

All templates consume the same CV data.

FR-05 Preview

The application displays an accurate representation of the final CV.

FR-06 PDF

The backend generates a professional A4 PDF.

FR-07 Payments

Premium templates require successful payment verification.

FR-08 Administration

Administrators have a dedicated authentication system and management interface.

FR-09 Storage

User photos and generated documents use Vercel Blob.

FR-10 Security

All APIs enforce authentication, authorization, validation, rate limiting and ownership checks.

4. EPR
EPR = Engineering Product Requirements
Architecture
                 MOBILE
        React Native + Expo
                 │
                 │ HTTPS
                 ▼
             VERCEL
       TypeScript API Layer
                 │
        ┌────────┼─────────┐
        ▼        ▼         ▼
      NEON     BLOB      SERVICES
   PostgreSQL  Storage   AI/Payment/PDF
Data model
users
  │
  └── cvs
       │
       ├── cv_profiles
       ├── educations
       ├── experiences
       ├── cv_skills
       ├── projects
       └── certifications

templates
   │
   └── cvs.template_id

users
   │
   └── purchases
          │
          └── templates

payments
   │
   └── purchases

admins
Critical relationship
User
 ↓
CV
 ↓
Structured Data
 ↓
Template
 ↓
Renderer
 ↓
PDF

Never:

User
 ↓
HTML document
Admin architecture
/admin
     │
     ├── Login
     ├── Dashboard
     ├── Users
     ├── CVs
     ├── Templates
     └── Payments

admins

Normal customers:

users

Administrators:

admins

They must not be mixed.

5. .gitignore

Use this as the project's .gitignore:

# Dependencies
node_modules/
.pnpm-store/
.yarn/
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Expo
.expo/
.expo-shared/
dist/
web-build/

# React Native
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*

# Android
android/.gradle/
android/app/build/
android/build/
android/local.properties
android/.idea/
android/captures/
android/.cxx/

# iOS
ios/Pods/
ios/build/
ios/.xcode.env.local
*.xcworkspace
DerivedData/

# Environment variables
.env
.env.local
.env.development
.env.production
.env.test
.env.*.local

# Vercel
.vercel/

# Vercel Blob / generated files
storage/
uploads/
generated/

# Database
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Coverage
coverage/
.nyc_output/

# Cache
.cache/
.parcel-cache/
.turbo/
.eslintcache

# TypeScript
*.tsbuildinfo

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo

# Temporary files
tmp/
temp/
*.tmp

# Generated PDFs
*.pdf

# Generated images
*.png
*.jpg
*.jpeg
*.webp

# Secrets
*.pem
*.crt
*.cer
secret*
credentials*
.env.example
DATABASE_URL=

AUTH_SECRET=

BLOB_READ_WRITE_TOKEN=

PAYMENT_SECRET_KEY=
PAYMENT_PUBLIC_KEY=
PAYMENT_WEBHOOK_SECRET=

AI_API_KEY=

Do not commit .env or real credentials to Git.

Recommended repository structure
cv-builder/
│
├── app/
│   ├── (auth)/
│   ├── (tabs)/
│   ├── cv/
│   ├── payment/
│   └── settings/
│
├── components/
│
├── features/
│   ├── auth/
│   ├── cv/
│   ├── templates/
│   ├── payments/
│   └── profile/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── types/
│
├── assets/
│
├── server/
│   ├── api/
│   ├── auth/
│   ├── admin/
│   ├── ai/
│   ├── payments/
│   ├── pdf/
│   └── storage/
│
├── db/
│   ├── schema/
│   └── migrations/
│
├── templates/
│   ├── classic/
│   ├── simple/
│   ├── professional/
│   ├── executive/
│   └── modern/
│
├── .env.example
├── .gitignore
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md

This gives you a single TypeScript ecosystem from mobile UI through API/business logic, with Neon PostgreSQL + Vercel Blob + Vercel as the infrastructure. It also leaves the template engine and database flexible enough to add AI, cover letters, ATS optimization, and other career features later without rebuilding the core.