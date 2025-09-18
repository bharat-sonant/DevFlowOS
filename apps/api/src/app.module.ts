import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UserTokensModule } from './modules/user_tokens/user_tokens.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './email/email.module';
import { DevToolsModule } from './modules/dev-tools/dev-tools.module';

const devModules = [];
if (process.env.NODE_ENV === 'development') {
  devModules.push(DevToolsModule);
}

@Module({
  imports: [
    ...devModules,
    PrismaModule,
    AuthModule,
    EmailModule,
    UserTokensModule,
    CompaniesModule,
    UsersModule,
  ],
})
export class AppModule {}
