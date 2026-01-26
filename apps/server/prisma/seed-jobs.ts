import 'dotenv/config';
import { PrismaClient, JobType, WorkMode, ExperienceLevel, JobStatus } from '@repo/db';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding jobs...');

    // 1. Ensure we have a recruiter user
    const recruiterEmail = 'recruiter@example.com';
    let recruiter = await prisma.user.findUnique({
        where: { email: recruiterEmail },
    });

    if (!recruiter) {
        recruiter = await prisma.user.create({
            data: {
                email: recruiterEmail,
                name: 'John Recruiter',
                role: 'RECRUITER',
                isVerified: true,
            },
        });
        console.log(`Created recruiter: ${recruiter.email}`);
    }

    // 2. Ensure we have a company
    const companyName = 'Tech Corp';
    let company = await prisma.company.findUnique({
        where: { name: companyName },
    });

    if (!company) {
        company = await prisma.company.create({
            data: {
                name: companyName,
                description: 'A leading tech company building the future.',
                industry: 'Technology',
                location: 'San Francisco, CA',
                recruiters: {
                    create: {
                        userId: recruiter.id,
                    },
                },
            },
        });
        console.log(`Created company: ${company.name}`);
    }

    // 3. Create Dummy Jobs
    const jobsData = [
        {
            title: 'Senior Frontend Engineer',
            description: 'We are looking for an experienced Frontend Engineer to lead our web development team. You will be working with React, Next.js, and TypeScript.',
            location: 'Remote',
            salaryMin: 120000,
            salaryMax: 160000,
            currency: 'USD',
            skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
            type: JobType.FULL_TIME,
            workMode: WorkMode.REMOTE,
            experienceLevel: ExperienceLevel.SENIOR,
            status: JobStatus.OPEN,
        },
        {
            title: 'Backend Developer',
            description: 'Join our backend team to build scalable APIs using NestJS and PostgreSQL.',
            location: 'New York, NY',
            salaryMin: 100000,
            salaryMax: 140000,
            currency: 'USD',
            skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
            type: JobType.FULL_TIME,
            workMode: WorkMode.HYBRID,
            experienceLevel: ExperienceLevel.MID,
            status: JobStatus.OPEN,
        },
        {
            title: 'Product Designer',
            description: 'We need a creative Product Designer to craft beautiful and intuitive user interfaces.',
            location: 'San Francisco, CA',
            salaryMin: 90000,
            salaryMax: 130000,
            currency: 'USD',
            skills: ['Figma', 'UI/UX', 'Prototyping'],
            type: JobType.CONTRACT,
            workMode: WorkMode.ONSITE,
            experienceLevel: ExperienceLevel.MID,
            status: JobStatus.OPEN,
        },
        {
            title: 'Junior DevOps Engineer',
            description: 'Start your career in DevOps with us. You will learn about CI/CD, Kubernetes, and Cloud Infrastructure.',
            location: 'Austin, TX',
            salaryMin: 70000,
            salaryMax: 90000,
            currency: 'USD',
            skills: ['Linux', 'Git', 'AWS', 'Python'],
            type: JobType.FULL_TIME,
            workMode: WorkMode.ONSITE,
            experienceLevel: ExperienceLevel.ENTRY,
            status: JobStatus.OPEN,
        },
        {
            title: 'Marketing Manager',
            description: 'Lead our marketing efforts and drive growth.',
            location: 'Remote',
            salaryMin: 80000,
            salaryMax: 110000,
            currency: 'USD',
            skills: ['Marketing', 'SEO', 'Content Strategy'],
            type: JobType.FULL_TIME,
            workMode: WorkMode.REMOTE,
            experienceLevel: ExperienceLevel.SENIOR,
            status: JobStatus.OPEN,
        }
    ];

    for (const job of jobsData) {
        await prisma.job.create({
            data: {
                ...job,
                companyId: company.id,
                postedById: recruiter.id,
            },
        });
    }

    console.log(`Seeded ${jobsData.length} jobs.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
