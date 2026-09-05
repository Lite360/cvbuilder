import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    integer,
    timestamp,
    jsonb,
    decimal
} from 'drizzle-orm/pg-core';

// 1. Users Table (Standard CV App Customers)
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', {length: 255}).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    fullName: varchar('full_name', {length: 255}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 2. Admins Table (Completely Isolated Administration System)
export const admins = pgTable('admins', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', {length: 255}).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: varchar('name', {length: 255}).notNull(),
    role: varchar('role', {length: 50}).default('admin').notNull(), // superadmin, admin
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 3. CV Templates Catalog
export const templates = pgTable('templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', {length: 100}).notNull(),
    slug: varchar('slug', {length: 100}).notNull().unique(),
    description: text('description'),
    previewImageUrl: text('preview_image_url'),
    isPremium: boolean('is_premium').default(false).notNull(),
    price: decimal('price', {
        precision: 10,
        scale: 2
    }).default('0.00').notNull(), // e.g. 2000.00 NGN
    isActive: boolean('is_active').default(true).notNull(),
    templateConfig: jsonb('template_config').default({}),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 4. CV Containers
export const cvs = pgTable('cvs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    templateId: uuid('template_id').references(() => templates.id).notNull(),
    title: varchar('title', {length: 255}).notNull(),
    cvType: varchar('cv_type', {length: 100}).default('Professional CV').notNull(), // Professional CV, Student CV, Academic CV, Resume
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 5. Personal Profile / Header Info
export const cvProfiles = pgTable('cv_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id').references(() => cvs.id, {onDelete: 'cascade'}).notNull().unique(),
    fullName: varchar('full_name', {length: 255}).notNull(),
    professionalTitle: varchar('professional_title', {length: 255}),
    email: varchar('email', {length: 255}),
    phone: varchar('phone', {length: 50}),
    location: varchar('location', {length: 255}),
    linkedinUrl: text('linkedin_url'),
    websiteUrl: text('website_url'),
    profilePhotoUrl: text('profile_photo_url'),
    professionalSummary: text('professional_summary'),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 6. Education Records
export const educations = pgTable('educations', {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id').references(() => cvs.id, {onDelete: 'cascade'}).notNull(),
    institution: varchar('institution', {length: 255}).notNull(),
    degree: varchar('degree', {length: 255}).notNull(),
    fieldOfStudy: varchar('field_of_study', {length: 255}),
    startDate: varchar('start_date', {length: 50}),
    endDate: varchar('end_date', {length: 50}),
    grade: varchar('grade', {length: 50}),
    description: text('description'),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 7. Work Experience Records
export const experiences = pgTable('experiences', {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id').references(() => cvs.id, {onDelete: 'cascade'}).notNull(),
    company: varchar('company', {length: 255}).notNull(),
    jobTitle: varchar('job_title', {length: 255}).notNull(),
    location: varchar('location', {length: 255}),
    startDate: varchar('start_date', {length: 50}),
    endDate: varchar('end_date', {length: 50}),
    isCurrent: boolean('is_current').default(false).notNull(),
    description: text('description'),
    bulletPoints: jsonb('bullet_points').default([]),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 8. Predefined Skills Library
export const skills = pgTable('skills', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', {length: 100}).notNull().unique(),
    category: varchar('category', {length: 100}),
    isPredefined: boolean('is_predefined').default(true).notNull()
});

// 9. CV Skills Mapping
export const cvSkills = pgTable('cv_skills', {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id').references(() => cvs.id, {onDelete: 'cascade'}).notNull(),
    skillName: varchar('skill_name', {length: 100}).notNull(),
    proficiencyLevel: varchar('proficiency_level', {length: 50}).default('Intermediate').notNull(), // Beginner, Intermediate, Advanced, Expert
    sortOrder: integer('sort_order').default(0).notNull()
});

// 10. Projects
export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id').references(() => cvs.id, {onDelete: 'cascade'}).notNull(),
    projectName: varchar('project_name', {length: 255}).notNull(),
    description: text('description'),
    technologies: varchar('technologies', {length: 255}),
    projectUrl: text('project_url'),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 11. Certifications
export const certifications = pgTable('certifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id').references(() => cvs.id, {onDelete: 'cascade'}).notNull(),
    name: varchar('name', {length: 255}).notNull(),
    issuingOrganization: varchar('issuing_organization', {length: 255}),
    issueDate: varchar('issue_date', {length: 50}),
    expirationDate: varchar('expiration_date', {length: 50}),
    credentialId: varchar('credential_id', {length: 255}),
    credentialUrl: text('credential_url'),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 12. Premium Template Purchases
export const purchases = pgTable('purchases', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    templateId: uuid('template_id').references(() => templates.id).notNull(),
    amount: decimal('amount', {
        precision: 10,
        scale: 2
    }).notNull(),
    paymentReference: varchar('payment_reference', {length: 255}).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 13. Payments Transaction Audit Log
export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    reference: varchar('reference', {length: 255}).notNull().unique(),
    provider: varchar('provider', {length: 50}).default('paystack').notNull(), // paystack, korapay
    status: varchar('status', {length: 50}).default('pending').notNull(), // pending, success, failed
    amount: decimal('amount', {
        precision: 10,
        scale: 2
    }).notNull(),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 14. Sessions / Refresh Tokens
export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// 15. Password Resets
export const passwordResets = pgTable('password_resets', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', {length: 255}).notNull(),
    token: varchar('token', {length: 255}).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});
