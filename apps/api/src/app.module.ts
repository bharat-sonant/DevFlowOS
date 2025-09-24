import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UserTokensModule } from './modules/user_tokens/user_tokens.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './email/email.module';
import { DevToolsModule } from './modules/dev-tools/dev-tools.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { LoggingService } from './common/services/logging.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ProjectsModule } from './modules/projects/projects.module';

const devModules = [];
if (process.env.NODE_ENV === 'development') {
  devModules.push(DevToolsModule);
}

@Module({
  providers: [
    LoggingService, // make sure this is provided
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  imports: [
    ...devModules,
    PrismaModule,
    AuthModule,
    EmailModule,
    UserTokensModule,
    CompaniesModule,
    UsersModule,
    ProjectsModule
  ],
})
export class AppModule { }
