
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
       await this.service.verifyEmailToken(token, email);
      return res.redirected(`${frontendUrl}/registrationForm?email=${encodeURIComponent(email)}&verified=true`);
      
    } catch (error : any) {
      // Error: Redirect to error page with specific error type
      let errorType = 'verification_failed';
      if (error.message.includes('expired')) {
        errorType = 'token_expired';
      } else if (error.message.includes('invalid') || error.message.includes('malformed')) {
        errorType = 'token_invalid';
      } else if (error.message.includes('already used')){
        errorType = 'token_used';
      } else if (error.message.includes('not found')){
        errorType = 'token_not_found';
      }
      return res.redirect(`${frontendUrl}/error?type=${errorType}&email=${encodeURIComponent(email)}`);
    }
  }


}
