// hosts all your dev-only endpoints

import { Controller, Post, Body, ForbiddenException, UseGuards, Get } from '@nestjs/common';
import { EmailService } from '../../email/email.service';
import { DevOnlyGuard } from 'src/common/guards/dev-only.guard';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/public.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('dev-tools')
@UseGuards(DevOnlyGuard)
export class DevToolsController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService
    ) { }

    @Public()
    @Get('testlogin')
    testLogin() {
        if (process.env.NODE_ENV !== 'development') {
            throw new ForbiddenException('Dev tools are only available in development mode');
        }
        return this.authService.testLogin();
    }

    @Public()
    @Post('send-test-email')
    @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['verification', 'reset', 'registration'],
          example: 'verification',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'ajaysharma.wevois@gmail.com',
        },
      },
      required: ['type', 'email'],
       example: { // pre-fills entire request body in Swagger
        type: 'verification',
        email: 'ajaysharma.wevois@gmail.com',
      }
    },
  })
  async sendTestEmail(@Body() body: any) {
        if (process.env.NODE_ENV !== 'development') {
            throw new ForbiddenException('Dev tools are only available in development mode');
        }

        const { type, email } = body;

        switch (type) {
            case 'verification':
                return this.emailService.sendVerificationEmail(email, 'dummy-verification-token');
            case 'reset':
                return this.emailService.sendPasswordResetEmail(email, 'dummy-reset-token');
            case 'registration':
                return this.emailService.sendNewRegistrationEmail(
                    email,
                    'EMP001',
                    'COMP123',
                    'Demo Company'
                );
            default:
                throw new Error(`Unsupported test email type: ${type}`);
        }
    }
}
