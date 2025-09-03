
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateCompaniesDto, UpdateCompaniesDto, CompaniesResponseDto } from "@om/shared";

@Injectable()
export class CompaniesServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: CreateCompaniesDto): Promise<CompaniesResponseDto> {
    const created = await this.prisma.companies.create({ data });
    return created as unknown as CompaniesResponseDto;
  }

  async findMany(): Promise<CompaniesResponseDto[]> {
    return this.prisma.companies.findMany() as unknown as CompaniesResponseDto[];
  }

  async findOne(id: string): Promise<CompaniesResponseDto | null> {
    return this.prisma.companies.findUnique({ where: { id } }) as unknown as CompaniesResponseDto;
  }

  async update(id: string, data: UpdateCompaniesDto): Promise<CompaniesResponseDto> {
    return this.prisma.companies.update({ where: { id }, data }) as unknown as CompaniesResponseDto;
  }

  async remove(id: string): Promise<CompaniesResponseDto> {
    return this.prisma.companies.delete({ where: { id } }) as unknown as CompaniesResponseDto;
  }
}
