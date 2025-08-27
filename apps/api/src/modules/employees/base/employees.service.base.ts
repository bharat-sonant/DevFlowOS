
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class employeesServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.employees.create({ data });
  }

  async findAll() {
    return this.prisma.employees.findMany();
  }

  async findOne(id: string) {
    return this.prisma.employees.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.employees.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.employees.delete({ where: { id } });
  }
}
