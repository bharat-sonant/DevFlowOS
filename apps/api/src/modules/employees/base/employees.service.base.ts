import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateEmployeesDto, UpdateEmployeesDto, EmployeesResponseDto } from "@om/shared";

@Injectable()
export class EmployeesServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: CreateEmployeesDto): Promise<EmployeesResponseDto> {
    return this.prisma.employees.create({ data });
  }

  async findMany(): Promise<EmployeesResponseDto[]> {
    return this.prisma.employees.findMany();
  }

  async findOne(id: string): Promise<EmployeesResponseDto | null> {
    return this.prisma.employees.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateEmployeesDto): Promise<EmployeesResponseDto> {
    return this.prisma.employees.update({ where: { id }, data });
  }

  async remove(id: string): Promise<EmployeesResponseDto> {
    return this.prisma.employees.delete({ where: { id } });
  }
}
