
import { Injectable } from "@nestjs/common";
import { CompaniesServiceBase } from "./base/companies.service.base";
import { PrismaService } from "prisma/prisma.service";
import * as crypto from "crypto";
import { UserTokenType } from "@om/shared";


@Injectable()
export class CompaniesService extends CompaniesServiceBase {
  constructor(protected readonly prisma : PrismaService){
    super(prisma)
  }
  // Add custom business logic here
  private generateCompanyCode() : string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const digits = "123456789";

    let alphaPart = "";
    for(let i=0; i< 3; i++){
      alphaPart += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    let numPart = "";
    for(let i=0; i<3; i++){
      numPart += digits.charAt(Math.floor(Math.random() * digits.length))
    }

    return alphaPart + numPart;
  }

  private generateHMACToken (email:string) : { token: string; expiresAt: Date } {
    const timeStamp = Date.now();
    const expiresAt = new Date(timeStamp + 24 * 60 * 60 * 1000) //24 hrs

    const data = `${email}:${timeStamp}:VERIFICATION`;
     const secretKey = process.env.HMAC_SECRET_KEY || 'your-default-secret-key-change-this-in-production';

     const signature = crypto.createHmac("sha256", secretKey).update(data).digest("hex");

      const tokenData = `${timeStamp}:${signature}`;
      const token = Buffer.from(tokenData).toString('base64url');

      return{token, expiresAt}
  }

  // Verify HMAC token
  verifyHMACToken(token: string, email: string): { valid: boolean; reason?: string } {
    try {
      // Decode the token
      const decoded = Buffer.from(token, 'base64url').toString();
      const [timestamp, signature] = decoded.split(':');
      
      // Check if timestamp exists
      if (!timestamp || !signature) {
        return { valid: false, reason: 'malformed_token' };
      }
      
      // Check expiration (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return { valid: false, reason: 'token_expired' };
      }
      
      // Verify signature
      const data = `${email}:${timestamp}:VERIFICATION`;
      const secretKey = process.env.HMAC_SECRET_KEY || 'your-default-secret-key-change-this-in-production';
      
      const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(data)
        .digest('hex');
      
      if (signature === expectedSignature) {
        return { valid: true };
      }
      
      return { valid: false, reason: 'invalid_signature' };
    } catch (error) {
      return { valid: false, reason: 'malformed_token' };
    }
  }

  async preRegister (email : string){
    const existing = await this.prisma.user_tokens.findFirst({
      where : {email},
    })

    if(existing){
      return{
        message : "company already pre-registered",
        companyId : existing.id,
        email : existing.email
      };
    }

  const { token, expiresAt } = this.generateHMACToken(email);


    const company = await this.prisma.user_tokens.create({
      data: {email,
        is_verified : false,
        type : UserTokenType.VERIFICATION,
        token : token,
        expires_at : expiresAt
      },
    });


    return {
      message: "Company pre-registered successfully",
      companyId: company.id,
      email: company.email,
     token: company.token,
      verificationUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/companies/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
    };
  }


 // Verify email with token
  async verifyEmailToken(token: string, email: string) {
    // Verify the HMAC token first
    const verification = this.verifyHMACToken(token, email);
    
    if (!verification.valid) {
      throw new Error(`Token verification failed: ${verification.reason}`);
    }

    // Find the token in database
    const userToken = await this.prisma.user_tokens.findFirst({
      where: {
        email: email,
        token: token,
        type: UserTokenType.VERIFICATION,
      },
    });

    if (!userToken) {
      throw new Error('Token not found in database');
    }

    if (userToken.is_verified) {
      throw new Error('Token already used');
    }

    // Check database expiration as well (double check)
    if (new Date() > userToken.expires_at) {
      throw new Error('Token expired');
    }

    // Mark as verified
    const updatedToken = await this.prisma.user_tokens.update({
      where: { id: userToken.id },
      data: { is_verified: true },
    });

    return {
      message: 'Email verified successfully',
      email: updatedToken.email,
      verified: true,
      tokenId: updatedToken.id
    };
  }
}