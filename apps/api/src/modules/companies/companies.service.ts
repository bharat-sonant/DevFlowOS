import { EmailService } from 'src/email/email.service';
import { CommonService } from 'src/common/services/common.service';

import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CompaniesServiceBase } from './base/companies.service.base';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';
import { UserTokenType } from '@om/shared';

@Injectable()
export class CompaniesService extends CompaniesServiceBase {
  private readonly logger = new Logger(CompaniesService.name);
  constructor(
    protected readonly prisma: PrismaService,
    private readonly CommonService: CommonService,
    private readonly EmailService: EmailService,
  ) {
    super(prisma);
  }

  async preRegister(email: string) {
    try {
      // 1. Check if user already exists globally
      const existingUser = await this.prisma.users.findFirst({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      // 2. Check if there’s an unverified pre-registration token already
      const existingToken = await this.prisma.user_tokens.findFirst({
        where: { email, type: UserTokenType.VERIFICATION, is_verified: false },
      });
      if (existingToken) {
        throw new ConflictException('Company already pre-registered');
      }

      const { token, expiresAt } = this.CommonService.generateToken(email);

      const userToken = await this.prisma.user_tokens.create({
        data: {
          email,
          is_verified: false,
          type: UserTokenType.VERIFICATION,
          token,
          expires_at: expiresAt,
        },
      });

      // 6. Generate verification link
      const verificationUrl = `${
        process.env.BASE_URL || 'http://localhost:3001'
      }/companies/auth/verify-email?token=${encodeURIComponent(token)}`;

      // 7. Send email (🔥 missing in your code)
      await this.EmailService.sendVerificationEmail(email, token);

      // 8. Return response
      return {
        success: true,
        message:
          'Company pre-registered successfully. Please check your email to verify.',
        email,
        companyId: userToken.id,
        verificationUrl, // optionally for debugging
      };
    } catch (err: any) {
      // If it's already an HttpException (like ConflictException), just re-throw it
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.code === 'P2002') {
        const target = err.meta?.target || [];
        if (target.includes('email')) {
          throw new ConflictException('Email already exists.');
        }
        throw new ConflictException('Duplicate data conflict');
      }

      this.logger.error('Pre-registration failed', err);
      throw new InternalServerErrorException('Pre-registration failed');
    }
  }

  // Verify email with token
  async verifyEmailToken(token: string) {
    try {
      // Find the token in database
      const userToken = await this.prisma.user_tokens.findFirst({
        where: {
          token: token,
          type: UserTokenType.VERIFICATION,
        },
      });

      if (!userToken) {
        throw new NotFoundException('Token not found in database');
      }

      if (userToken.is_verified) {
        throw new ConflictException(
          'This verification link has already been used.',
        );
      }

      // Verify HMAC signature and timestamp
      const verification = this.CommonService.verifyToken(
        token,
        userToken.email,
      );

      if (!verification.valid) {
        if (!verification.valid)
          throw new BadRequestException(`Invalid link: ${verification.reason}`);
      }

      // Double-check database expiration
      if (new Date() > userToken.expires_at) {
        throw new BadRequestException('Verification link has expired.');
      }

      // Mark as verified
      // const updatedToken = await this.prisma.user_tokens.update({
      //   where: { id: userToken.id },
      //   data: { is_verified: true },
      // });

      return {
        success: true,
        message: 'Token is valid',
        email: userToken.email,
        tokenId: userToken.id,
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }

      // Fallback
      console.error('Email verification failed', err);
      throw new InternalServerErrorException('Email verification failed.');
    }
  }
}
