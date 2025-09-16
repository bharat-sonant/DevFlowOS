
import { BadRequestException, Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { CompaniesControllerBase } from "./base/companies.controller.base";
import { CompaniesService } from "./companies.service";
import { Response } from "express";


@Controller("companies")
export class CompaniesController extends CompaniesControllerBase {
  constructor(protected readonly service: CompaniesService) {
    super(service);
  }

  // ✅ Add custom endpoints here
  @Post("/auth/pre-register")
  async preRegister (@Body("email") email: string){
    const result = await this.service.preRegister(email);
    if(!result){
      throw new BadRequestException("Company could not be pre-registered.")
    }
    return result;
  }

  // ✅ Email verification endpoint (redirects to frontend)
  @Get("/auth/verify-email")
  async verifyEmail(
    @Query("token") token: string,
    @Query("email") email: string,
    @Res() res: Response
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    if (!token || !email) {
      return res.redirect(`${frontendUrl}/error?type=missing_params`);
    }

    try {
      const result = await this.service.verifyEmailToken(token, email);
      
      // Success: Redirect to registration form
      return res.redirect(`${frontendUrl}/registrationForm?email=${encodeURIComponent(email)}&verified=true`);
      
    } catch (error : any) {
      // Error: Redirect to error page with specific error type
      let errorType = 'verification_failed';
      
      if (error.message.includes('expired')) {
        errorType = 'token_expired';
      } else if (error.message.includes('invalid') || error.message.includes('malformed')) {
        errorType = 'token_invalid';
      } else if (error.message.includes('already used')) {
        errorType = 'token_used';
      } else if (error.message.includes('not found')) {
        errorType = 'token_not_found';
      }
      
      return res.redirect(`${frontendUrl}/error?type=${errorType}&email=${encodeURIComponent(email)}`);
    }
  }

  // ✅ Token verification API endpoint (for testing or API access)
  @Post("/auth/verify-token")
  async verifyToken(
    @Body("token") token: string,
    @Body("email") email: string
  ) {
    if (!token || !email) {
      throw new BadRequestException("Token and email are required");
    }

    try {
      const result = await this.service.verifyEmailToken(token, email);
      return {
        success: true,
        ...result
      };
    } catch (error:any) {
      throw new BadRequestException(`Token verification failed: ${error.message}`);
    }
  }

  // ✅ Check token validity without marking as used
  @Post("/auth/check-token")
  async checkToken(
    @Body("token") token: string,
    @Body("email") email: string
  ) {
    if (!token || !email) {
      throw new BadRequestException("Token and email are required");
    }

    const verification = this.service.verifyHMACToken(token, email);
    
    return {
      valid: verification.valid,
      reason: verification.reason || 'Token is valid',
    };
  }

  // Helper method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
