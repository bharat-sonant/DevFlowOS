import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { EmployeeModule } from './modules/Employee/employee.module';

@Module({
  imports: [PrismaModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
