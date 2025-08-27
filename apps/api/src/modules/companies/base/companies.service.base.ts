
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class companiesServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.companies.create({ data });
  }

  async findAll() {
    return this.prisma.companies.findMany();
  }

  async findOne(id: string) {
    return this.prisma.companies.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.companies.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.companies.delete({ where: { id } });
  }
}
