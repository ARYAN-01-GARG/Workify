import { TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

// Mock config to avoid environment dependencies
jest.mock('../common/config', () => ({
  config: {
    google: {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      callbackUrl: 'http://localhost:3001/auth/callback',
    },
    jwt: {
      expiresIn: '1h',
    },
  },
}));

// Mock googleapis
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn(),
      })),
    },
  },
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
    },
  } as unknown as PrismaService;

  const mockJwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = testingModule.get<AuthService>(AuthService);
    prismaService = testingModule.get<PrismaService>(PrismaService);
    jwtService = testingModule.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleGoogleAuth', () => {
    const validIdToken = 'valid.id.token';
    const mockPayload = {
      email: 'test@example.com',
      sub: 'google-user-id',
    };
    const mockUser = {
      id: 'user-id-123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    beforeEach(() => {
      // Mock OAuth2 verifyIdToken method
      const mockOAuth2Client = (google.auth.OAuth2 as jest.MockedClass<typeof google.auth.OAuth2>).mock.results[0]
        .value;
      mockOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload,
      });
    });

    it('should successfully authenticate user with valid token', async () => {
      const mockFindFirst = mockPrismaService.user.findFirst as jest.Mock;
      const mockSignAsync = mockJwtService.signAsync as jest.Mock;

      mockFindFirst.mockResolvedValue(mockUser);
      mockSignAsync.mockResolvedValue('jwt-token');

      const result = await service.handleGoogleAuth(validIdToken);

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          avatarUrl: mockUser.avatarUrl,
        },
      });

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { email: mockPayload.email },
      });
      expect(mockSignAsync).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockPayload.email,
          avatarUrl: mockUser.avatarUrl,
          name: mockUser.name,
          sub: mockPayload.sub,
        },
        { expiresIn: '1h' }
      );
    });

    it('should throw UnauthorizedException when user not found in database', async () => {
      // Reset the mock to return successful OAuth verification
      const mockOAuth2Client = (google.auth.OAuth2 as jest.MockedClass<typeof google.auth.OAuth2>).mock.results[0]
        .value;
      mockOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload,
      });

      (mockPrismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      // Due to the catch-all error handler, all errors become "Invalid google id token"
      await expect(service.handleGoogleAuth(validIdToken)).rejects.toThrow(
        new UnauthorizedException('Invalid google id token')
      );
    });

    it('should throw UnauthorizedException when token payload is invalid', async () => {
      const mockOAuth2Client = (google.auth.OAuth2 as jest.MockedClass<typeof google.auth.OAuth2>).mock.results[0]
        .value;
      mockOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => null,
      });

      await expect(service.handleGoogleAuth(validIdToken)).rejects.toThrow(
        new UnauthorizedException('Invalid google id token')
      );
    });

    it('should throw UnauthorizedException when email is missing from payload', async () => {
      const mockOAuth2Client = (google.auth.OAuth2 as jest.MockedClass<typeof google.auth.OAuth2>).mock.results[0]
        .value;
      mockOAuth2Client.verifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: 'google-user-id' }), // Missing email
      });

      await expect(service.handleGoogleAuth(validIdToken)).rejects.toThrow(
        new UnauthorizedException('Invalid google id token')
      );
    });

    it('should handle errors during token verification', async () => {
      const mockOAuth2Client = (google.auth.OAuth2 as jest.MockedClass<typeof google.auth.OAuth2>).mock.results[0]
        .value;
      mockOAuth2Client.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.handleGoogleAuth(validIdToken)).rejects.toThrow(
        new UnauthorizedException('Invalid google id token')
      );
    });

    it('should handle user with null name', async () => {
      const mockFindFirst = mockPrismaService.user.findFirst as jest.Mock;
      const mockSignAsync = mockJwtService.signAsync as jest.Mock;

      const userWithoutName = { ...mockUser, name: null };
      mockFindFirst.mockResolvedValue(userWithoutName);
      mockSignAsync.mockResolvedValue('jwt-token');

      const result = await service.handleGoogleAuth(validIdToken);

      expect(mockSignAsync).toHaveBeenCalledWith(
        {
          id: userWithoutName.id,
          email: mockPayload.email,
          avatarUrl: userWithoutName.avatarUrl,
          name: 'Unknown', // Should default to 'Unknown'
          sub: mockPayload.sub,
        },
        { expiresIn: '1h' }
      );
    });
  });
});
