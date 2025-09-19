// apps/api/src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { verificationTemplate } from './templates/verification.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { newRegistrationTemplate } from './templates/new-registration.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly mailApiUrl: string;

  constructor() {
    if (!process.env.MAILAPI_URL) {
      throw new Error('MAILAPI_URL environment variable is not set');
    }
    this.mailApiUrl = process.env.MAILAPI_URL;
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await axios.post(this.mailApiUrl, { to, subject, html });
      const success = response.status === 200;
      this.logger.log(
        success
          ? `Email sent successfully to ${to} with subject "${subject}"`
          : `Email failed to send to ${to} with subject "${subject}"`
      );
      return success;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error sending email to ${to}: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Unknown error sending email to ${to}: ${JSON.stringify(error)}`);
      }
      throw error;
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const subject = 'Verify your email';
    const html = verificationTemplate(token);
    return this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
    const subject = 'Reset your password';
    const html = resetPasswordTemplate(token);
    return this.sendEmail(to, subject, html);
  }

  async sendNewRegistrationEmail(
    to: string,
    username: string,
    // password: string,
    companyCode: string,
    companyName: string,
  ): Promise<boolean> {
    const subject = 'Task Management Login Credentials';
    const html = newRegistrationTemplate(
      companyCode,
      username,
      // password,
      companyName,
    );
    return this.sendEmail(to, subject, html);
  }
}
