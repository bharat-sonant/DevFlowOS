// src/auth/auth.service.ts
import {
  BadRequestException, ConflictException, Injectable,
  InternalServerErrorException, UnauthorizedException, Logger
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './token.service';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { CommonService } from 'src/common/services/common.service';
import { LoginDto, RegisterDto } from '@om/shared';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private commonService: CommonService,
    private emailService: EmailService
  ) { }

  async validateUser(email: string, password: string, companyId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        company_id_email: {
          company_id: companyId, // must come from login input
          email,
        },
      },
    });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password_hash ?? '');
    if (!ok) return null;
    const { password: _p, ...safe } = user as any;
    return safe;
  }

  async register(dto: RegisterDto) {
    const { companyName, username, password, userTokenId } = dto;

    // Step 1: validate token
    const token = await this.prisma.user_tokens.findUnique({
      where: { id: userTokenId },
    });

    console.log('tokennn', token)

    if (!token || token.is_verified || token.expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const email = token.email;

    // Step 2: generate company code
    const companyCodeLength =
      parseInt(process.env.COMPANY_CODE_LENGTH || '6', 10) || 6;

    let companyCode: string | null = null;
    for (let i = 0; i < 10; i++) {
      const code = this.commonService.generateCode(companyCodeLength);
      const exists = await this.prisma.companies.findUnique({ where: { code } });
      if (!exists) {
        companyCode = code;
        break;
      }
    }
    if (!companyCode) {
      throw new InternalServerErrorException(
        'Failed to generate unique company code',
      );
    }

    // Step 3: hash password
    const passwordHash = await this.commonService.hashPassword(password);

    // Step 4: transaction
    try {
      const [company, user] = await this.prisma.$transaction(async (prisma) => {
        const c = await prisma.companies.create({
          data: {
            name: companyName,
            code: companyCode!,
            email: email,
          },
        });

        const u = await prisma.users.create({
          data: {
            company_id: c.id,
            email,
            username,
            password_hash: passwordHash,
            is_owner: true,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        await prisma.user_tokens.update({
          where: { id: userTokenId },
          data: {
            user_id: u.id,
            is_verified: true,
            used_at: new Date(),
          },
        });

        return [c, u];
      });

      // Step 5: send registration email
      try {
        await this.emailService.sendNewRegistrationEmail(
          email,
          username,
          // password, 
          company.code,
          company.name,
        );
      } catch (err) {
        this.logger.error('Failed to send registration email', err as any);
      }

      return {
        isSuccess: true,
        message:
          'Registration successful. Check your email for company details.',
      };
    } catch (err: any) {
      if (err.code === 'P2002') {
        const target = err.meta?.target || [];
        if (target.includes('username')) {
          throw new ConflictException('Username already exists.');
        }
        if (target.includes('name')) {
          throw new ConflictException('Company with this name already exists.');
        }
        throw new ConflictException('Duplicate data conflict');
      }
      this.logger.error('Registration failed', err);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async validateCompany(companyCode: string) {
    const company = await this.prisma.companies.findUnique({
      where: { code: companyCode },
    });

    if (!company) {
      throw new BadRequestException('Invalid company code');
    }

    return {
      companyId: company.id,
      companyName: company.name,
      companyCode: company.code,
    };
  }

  async login(dto: LoginDto) {
    // validate UUID before hitting DB
    if (!isUUID(dto.companyId)) {
      throw new UnauthorizedException('Invalid company ID!');
    }
    const company = await this.prisma.companies.findUnique({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new UnauthorizedException('Invalid company!');
    }

    const user = await this.prisma.users.findFirst({
      where: {
        company_id: company.id,
        username: dto.username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const isPasswordValid = await this.commonService.comparePassword(
      dto.password,
      user.password_hash!,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const { accessToken, expiresIn } = await this.tokenService.createAccessToken(
      user.id,
      dto.companyId,
      user.email,
      user.is_owner!,
      dto.rememberMe,
    );

    return {
      token: accessToken,
      expiresIn,
      user: {
        id: user.id,
        username: user.username,
        isOwner: user.is_owner,
      },
      company: {
        id: company.id,
        code: company.code,
        name: company.name,
      },
    };
  }

  async testLogin() {
    // hardcoded fake user
    const fakeUserId = '00000000-0000-0000-0000-000000000002';
    const fakeEmail = 'dummy@example.com';

    // always issues a valid token, no DB check
    return this.tokenService.createAccessToken(fakeUserId,'00000000-0000-0000-0000-000000000001', fakeEmail,false, false);
  }
}
