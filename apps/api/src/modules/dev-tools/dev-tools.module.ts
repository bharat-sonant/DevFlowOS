import { Module } from '@nestjs/common';
import { EmailModule } from '../../email/email.module';
import { DevToolsController } from './dev-tools.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EmailModule, AuthModule],
  controllers: [DevToolsController],
})
export class DevToolsModule {}
