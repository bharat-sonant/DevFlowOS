import { Injectable } from "@nestjs/common";
import { CompaniesServiceBase } from "./base/companies.service.base";

@Injectable()
export class CompaniesService extends CompaniesServiceBase {
  async isCodeAvailable(code: string, excludeId?: string): Promise<boolean> {
    const company = await this.prisma.companies.findFirst({
      where: {
        code,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });
    return !company;
  }
}
