import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

// Mock the config module
jest.mock('src/common/config', () => ({
  config: {
    mail: {
      defaults: {
        from: 'noreply@example.com',
        fromName: 'Test App',
      },
      smtp: {
        auth: {
          user: 'test@example.com',
        },
      },
    },
  },
}));

describe('MailService', () => {
  let service: MailService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with mailerService injected', () => {
    expect(service).toBeInstanceOf(MailService);
    // Constructor should be called during service instantiation
    expect(service).toHaveProperty('mailerService');
    // Ensure constructor was executed by verifying mailerService is accessible
    expect((service as any).mailerService).toBe(mockMailerService);
  });

  it('should have constructor that accepts MailerService', () => {
    // This test ensures the constructor signature is covered
    const newService = new MailService(mockMailerService as any);
    expect(newService).toBeInstanceOf(MailService);
    expect((newService as any).mailerService).toBe(mockMailerService);
  });

  describe('sendMail', () => {
    it('should send email successfully', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <noreply@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with HTML content', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test HTML</h1>',
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <noreply@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with both text and HTML content', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Plain text version',
        html: '<h1>HTML version</h1>',
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <noreply@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with only required fields', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <noreply@example.com>',
        to: 'test@example.com',
        subject: 'Test Subject',
      });
    });

    it('should send email to multiple recipients', async () => {
      const emailOptions = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        text: 'Test content',
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <noreply@example.com>',
        ...emailOptions,
      });
    });

    it('should return false when email sending fails', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockMailerService.sendMail.mockRejectedValue(new Error('SMTP Error'));

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send email:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle network errors gracefully', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockMailerService.sendMail.mockRejectedValue(new Error('Network timeout'));

      const result = await service.sendMail(emailOptions);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send email:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('sendMailWithAttachment', () => {
    it('should send email with attachment successfully', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        attachments: [
          {
            filename: 'test.pdf',
            content: Buffer.from('test content'),
          },
        ],
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with multiple attachments', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        attachments: [
          {
            filename: 'test1.pdf',
            content: Buffer.from('test content 1'),
          },
          {
            filename: 'test2.txt',
            content: 'test content 2',
          },
        ],
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });

    it('should send email without attachments', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with attachment and HTML content', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>HTML Content</h1>',
        attachments: [
          {
            filename: 'test.pdf',
            content: Buffer.from('test content'),
          },
        ],
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with attachment to multiple recipients', async () => {
      const emailOptions = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        text: 'Test content',
        attachments: [
          {
            filename: 'test.pdf',
            content: Buffer.from('test content'),
          },
        ],
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });

    it('should send email with attachment containing string content', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        attachments: [
          {
            filename: 'test.txt',
            content: 'string content', // String instead of Buffer
          },
        ],
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });

    it('should return false when email with attachment fails', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        attachments: [
          {
            filename: 'test.pdf',
            content: Buffer.from('test content'),
          },
        ],
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockMailerService.sendMail.mockRejectedValue(new Error('Attachment error'));

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send email with attachment:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle large attachments', async () => {
      const largeBuffer = Buffer.alloc(1024 * 1024); // 1MB buffer
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        attachments: [
          {
            filename: 'large-file.pdf',
            content: largeBuffer,
          },
        ],
      };

      mockMailerService.sendMail.mockResolvedValue(undefined);

      const result = await service.sendMailWithAttachment(emailOptions);

      expect(result).toBe(true);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <test@example.com>',
        ...emailOptions,
      });
    });
  });

  // Explicitly test constructor to ensure line 28 is covered
  it('should create instance with constructor', () => {
    const mailerService = { sendMail: jest.fn() };
    const mailService = new MailService(mailerService as any);
    expect(mailService).toBeInstanceOf(MailService);
    expect((mailService as any).mailerService).toBe(mailerService);
  });

  // Explicitly test sendMail method signature to ensure line 49 is covered
  it('should have sendMail method with correct signature', async () => {
    const emailOptions = {
      to: 'test@example.com',
      subject: 'Test',
    };
    mockMailerService.sendMail.mockResolvedValue(undefined);
    await service.sendMail(emailOptions);
    expect(mockMailerService.sendMail).toHaveBeenCalled();
  });

  // Explicitly test sendMailWithAttachment method signature to ensure line 93 is covered
  it('should have sendMailWithAttachment method with correct signature', async () => {
    const emailOptions = {
      to: 'test@example.com',
      subject: 'Test',
      attachments: [{ filename: 'test.txt', content: 'content' }],
    };
    mockMailerService.sendMail.mockResolvedValue(undefined);
    await service.sendMailWithAttachment(emailOptions);
    expect(mockMailerService.sendMail).toHaveBeenCalled();
  });
});
