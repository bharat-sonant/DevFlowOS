import { api } from './api'
import type {
  CreateCompaniesDto,
  UpdateCompaniesDto,
  CompaniesResponseDto
} from '@om/shared'

const base = '/companies'

export const CompanyService = {
  async list(): Promise<CompaniesResponseDto[]> {
    const { data } = await api.get(base)
    return data
  },
  async create(payload: CreateCompaniesDto): Promise<CompaniesResponseDto> {
    const { data } = await api.post(base, payload)
    return data
  },
  async update(id: string, payload: UpdateCompaniesDto): Promise<CompaniesResponseDto> {
    const { data } = await api.put(`${base}/${id}`, payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`${base}/${id}`)
  },
}
