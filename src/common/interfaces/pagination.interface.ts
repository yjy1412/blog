import { BaseModel } from '../entities/base.entity';

export class PaginationResponse<T extends BaseModel> {
  data: T[];
  page: {
    currentPage: number;
    totalPage: number;
  };
}
