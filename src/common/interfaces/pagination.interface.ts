import { BaseModel } from '../entities/base.entity';

export class Pagination<T extends BaseModel> {
  data: T[];
  page: {
    cursor: {
      after: number | null;
    };
    count: number;
    nextUrl: string | null;
  };
}
