import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class CommonService {
  /**
   * Generate a random alphanumeric code
   * @param length number of characters
   * @param charset optional custom charset
   */
  generateCode(length: number, charset?: string): string {
    const chars = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('');
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }


  /**
   * Hash a password using bcrypt
   * @param password plain text password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hash(password, saltRounds);
  }

  generateToken (email:string) : { token: string; expiresAt: Date } {
    const timeStamp = Date.now();
    const expiresAt = new Date(timeStamp + 24 * 60 * 60 * 1000) //24 hrs

    const data = `${email}:${timeStamp}:VERIFICATION`;
     const secretKey = process.env.HMAC_SECRET_KEY || 'your-default-secret-key-change-this-in-production';

     const signature = crypto.createHmac('sha256', secretKey).update(data).digest('hex');

      const tokenData = `${timeStamp}:${signature}`;
      const token = Buffer.from(tokenData).toString('base64url');

      return{token, expiresAt}
  }

}