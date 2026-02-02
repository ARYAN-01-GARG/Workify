import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Sprint 2: Hiring Pipeline Flow (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let recruiterToken: string;
  let candidateToken: string;
  let recruiterId: string;
  let candidateId: string;
  let jobId: string;
  let applicationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    // Clean DB slightly
    await prisma.interview.deleteMany();
    await prisma.interviewRoundConfig.deleteMany();
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    // Clean up specific test users to ensure profiles are re-created
    // Must delete profiles first due to FK constraints
    await prisma.recruiterProfile.deleteMany({ where: { user: { email: { in: ['recruiter_sprint2@test.com'] } } } });
    await prisma.candidateProfile.deleteMany({ where: { user: { email: { in: ['candidate_sprint2@test.com'] } } } });

    await prisma.user.deleteMany({
      where: {
        email: { in: ['recruiter_sprint2@test.com', 'candidate_sprint2@test.com'] },
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const createTestUser = async (email: string, role: 'RECRUITER' | 'CANDIDATE') => {
    // Check if exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: role === 'RECRUITER' ? 'Test Recruiter' : 'Test Candidate',
          password: 'hash', // Simulate hash
          role,
        },
      });

      if (role === 'CANDIDATE') {
        await prisma.candidateProfile.create({ data: { userId: user.id } });
      } else if (role === 'RECRUITER') {
        const company = await prisma.company.create({
          data: {
            name: 'Test Company ' + Date.now(),
            description: 'Test Desc',
            website: 'https://test.com',
            industry: 'TECH',
          },
        });
        await prisma.recruiterProfile.create({
          data: {
            userId: user.id,
            companyId: company.id,
          },
        });
      }
    }
    const token = jwtService.sign({
      id: user.id, // RequestUser expects id
      sub: user.id, // Standards expect sub
      email: user.email,
      role: user.role,
      name: user.name, // RequestUser expects name
    });
    return { id: user.id, token };
  };

  it('Setup Users', async () => {
    const recruiter = await createTestUser('recruiter_sprint2@test.com', 'RECRUITER');
    recruiterId = recruiter.id;
    recruiterToken = recruiter.token;

    const candidate = await createTestUser('candidate_sprint2@test.com', 'CANDIDATE');
    candidateId = candidate.id;
    candidateToken = candidate.token;
  });

  it('1. Recruiter creates a Job', async () => {
    const res = await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        title: 'Software Engineer',
        description: 'Great job description here.',
        location: 'Remote',
        type: 'FULL_TIME',
        workMode: 'REMOTE',
        experienceLevel: 'MID',
        salaryMin: 100000,
        salaryMax: 150000,
        currency: 'USD',
        skills: ['NestJS', 'React'],
      })
      .expect(201);

    jobId = res.body.id;
    expect(jobId).toBeDefined();
  });

  it('2. Recruiter adds Interview Rounds', async () => {
    // Round 1: Technical
    await request(app.getHttpServer())
      .post(`/jobs/${jobId}/rounds`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        roundType: 'TECHNICAL',
        roundNumber: 1,
        isRequired: true,
      })
      .expect(201);

    // Round 2: HR
    await request(app.getHttpServer())
      .post(`/jobs/${jobId}/rounds`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        roundType: 'HR',
        roundNumber: 2,
        isRequired: true,
      })
      .expect(201);

    const rounds = await request(app.getHttpServer())
      .get(`/jobs/${jobId}/rounds`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .expect(200);

    expect(rounds.body).toHaveLength(2);
  });

  it('3. Candidate applies to the Job', async () => {
    const res = await request(app.getHttpServer())
      .post(`/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${candidateToken}`)
      .send({
        coverLetter: 'I am the best candidate.',
      })
      .expect(201);

    // The response might be the application or just success, let's verify via DB or GET
    const apps = await prisma.application.findMany({ where: { jobId, candidateProfile: { userId: candidateId } } });
    expect(apps).toHaveLength(1);
    applicationId = apps[0].id;
    expect(apps[0].status).toBe('PENDING');
  });

  it('4. Recruiter reviews and shortlists (Auto-Interview Creation)', async () => {
    // Move to REVIEWING
    await request(app.getHttpServer())
      .patch(`/jobs/${jobId}/applications/${applicationId}`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ status: 'REVIEWING' })
      .expect(200);

    // Move to SHORTLISTED - This triggers the interview creation
    await request(app.getHttpServer())
      .patch(`/jobs/${jobId}/applications/${applicationId}`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ status: 'SHORTLISTED' })
      .expect(200);

    // Verify status
    const fetchedApp = await prisma.application.findUnique({ where: { id: applicationId } });
    expect(fetchedApp).toBeDefined();
    expect(fetchedApp!.status).toBe('SHORTLISTED');
  });

  it('5. Verify Interview Created', async () => {
    // Check if interview exists
    const interviews = await prisma.interview.findMany({
      where: { applicationId },
    });

    expect(interviews).toHaveLength(1);
    expect(interviews[0].roundNumber).toBe(1);
    expect(interviews[0].roundType).toBe('TECHNICAL');
    expect(interviews[0].status).toBe('SCHEDULED');
    expect(interviews[0].assignedTo).toBe(recruiterId); // Should be assigned to job owner by default logic
  });

  it('6. Candidate Withdraws (Optional Flow)', async () => {
    // Just verifying endpoint availability
    const res = await request(app.getHttpServer())
      .get(`/jobs/${jobId}/my-application`)
      .set('Authorization', `Bearer ${candidateToken}`);

    if (res.status !== 200) {
      console.error('Status Check Failed:', res.body);
      // If 404, it might mean application not found, but we created it.
    }
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SHORTLISTED');
  });
});
