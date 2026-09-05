import {db} from './client';
import {templates, admins, skills} from './schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
    console.log('Seeding database templates, predefined skills, and initial admin...');

    // 1. Initial Admin Account
    const adminPassword = await bcrypt.hash('AdminPassword123!', 10);
    await db.insert(admins).values({email: 'admin@cvbuilder.com', passwordHash: adminPassword, name: 'System Administrator', role: 'superadmin'}).onConflictDoNothing();

    // 2. Default Templates (3 Free, 2 Premium)
    const defaultTemplates = [
        {
            name: 'Classic Standard',
            slug: 'classic',
            description: 'Clean traditional layout for corporate and traditional industry resumes.',
            previewImageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
            isPremium: false,
            price: '0.00',
            isActive: true,
            templateConfig: {
                primaryColor: '#1e293b',
                accentColor: '#475569',
                font: 'serif'
            }
        },
        {
            name: 'Simple Minimal',
            slug: 'simple',
            description: 'Minimalist whitespace design focused strictly on key information.',
            previewImageUrl: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80',
            isPremium: false,
            price: '0.00',
            isActive: true,
            templateConfig: {
                primaryColor: '#0f172a',
                accentColor: '#334155',
                font: 'sans-serif'
            }
        },
        {
            name: 'Professional Slate',
            slug: 'professional',
            description: 'Modern split header layout with high readability for experienced roles.',
            previewImageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&q=80',
            isPremium: false,
            price: '0.00',
            isActive: true,
            templateConfig: {
                primaryColor: '#2563eb',
                accentColor: '#1d4ed8',
                font: 'sans-serif'
            }
        },
        {
            name: 'Executive Leadership',
            slug: 'executive',
            description: 'Sophisticated dual-column template tailored for management and executive positions.',
            previewImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
            isPremium: true,
            price: '2000.00',
            isActive: true,
            templateConfig: {
                primaryColor: '#0f766e',
                accentColor: '#115e59',
                font: 'sans-serif'
            }
        }, {
            name: 'Modern Creative',
            slug: 'modern',
            description: 'Vibrant sidebar layout featuring highlight badges and visual skill indicators.',
            previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
            isPremium: true,
            price: '2500.00',
            isActive: true,
            templateConfig: {
                primaryColor: '#7c3aed',
                accentColor: '#6d28d9',
                font: 'sans-serif'
            }
        },
    ];

    for (const t of defaultTemplates) {
        await db.insert(templates).values(t).onConflictDoNothing();
    }

    // 3. Predefined Skills Library
    const predefinedSkills = [
        {
            name: 'JavaScript',
            category: 'Software Development'
        },
        {
            name: 'TypeScript',
            category: 'Software Development'
        },
        {
            name: 'React Native',
            category: 'Mobile Development'
        },
        {
            name: 'Node.js',
            category: 'Backend Development'
        }, {
            name: 'Python',
            category: 'Data & AI'
        }, {
            name: 'SQL / PostgreSQL',
            category: 'Databases'
        }, {
            name: 'Project Management',
            category: 'Management'
        }, {
            name: 'UI/UX Design',
            category: 'Design'
        },
    ];

    for (const s of predefinedSkills) {
        await db.insert(skills).values({
            ... s,
            isPredefined: true
        }).onConflictDoNothing();
    }

    console.log('Database seeding complete!');
}
