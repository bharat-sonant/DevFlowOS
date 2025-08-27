
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { employeesService } from './employees.service';
import { employeesController } from './employees.controller';
import { employeesServiceBase } from './base/employees.service.base';

@Module({
  providers: [employeesService, employeesServiceBase, PrismaService],
  controllers: [employeesController],
})
export class employeesModule {}
