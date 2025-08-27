
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { companiesService } from './companies.service';
import { companiesController } from './companies.controller';
import { companiesServiceBase } from './base/companies.service.base';

@Module({
  providers: [companiesService, companiesServiceBase, PrismaService],
  controllers: [companiesController],
})
export class companiesModule {}
