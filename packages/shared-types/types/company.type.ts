export interface ICompany {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface ICreateCompany {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export type IUpdateCompany = Partial<ICreateCompany>;

export interface ICompanyQuery {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  location?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
