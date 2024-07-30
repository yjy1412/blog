import { BaseModel } from '../entities/base.entity';

export class PaginationResponse<T extends BaseModel> {
  data: T[];
  page: {
    cursor: {
      after: number | null;
    };
    count: number;
    nextUrl: string | null;
  };
}
