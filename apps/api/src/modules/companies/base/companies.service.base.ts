import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateCompaniesDto, UpdateCompaniesDto, CompaniesResponseDto } from "@om/shared";

@Injectable()
export class CompaniesServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: CreateCompaniesDto): Promise<CompaniesResponseDto> {
    return this.prisma.companies.create({ data });
  }

  async findMany(): Promise<CompaniesResponseDto[]> {
    return this.prisma.companies.findMany();
  }

  async findOne(id: string): Promise<CompaniesResponseDto | null> {
    return this.prisma.companies.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateCompaniesDto): Promise<CompaniesResponseDto> {
    return this.prisma.companies.update({ where: { id }, data });
  }

  async remove(id: string): Promise<CompaniesResponseDto> {
    return this.prisma.companies.delete({ where: { id } });
  }
}
