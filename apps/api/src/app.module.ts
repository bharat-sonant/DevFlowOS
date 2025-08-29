import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [PrismaModule, EmployeesModule, CompaniesModule]
})
export class AppModule {}
