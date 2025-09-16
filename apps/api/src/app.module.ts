import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UserTokensModule } from './modules/user_tokens/user_tokens.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [PrismaModule, UserTokensModule, CompaniesModule, UsersModule]
})
export class AppModule {}
