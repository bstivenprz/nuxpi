import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_PAGINATION_LIMIT = 100;

export class PaginationMetaObject {
  readonly page: number;

  readonly take: number;

  readonly total_count: number;

  readonly page_count: number;

  readonly has_previous_page: boolean;

  readonly has_next_page: boolean;

  constructor({ options, total_count }) {
    this.page = options.page;
    this.take = options.take;
    this.total_count = total_count;
    this.page_count = Math.ceil(this.total_count / this.take);
    this.has_previous_page = this.page > 1;
    this.has_next_page = this.page < this.page_count;
  }
}

export class PaginationQuery {
  @Type(() => Number)
  @IsInt()
  @Min(DEFAULT_PAGE)
  @IsOptional()
  page?: number = DEFAULT_PAGE;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGINATION_LIMIT)
  @IsOptional()
  take?: number = DEFAULT_LIMIT;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

export class PaginationObject<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PaginationMetaObject;

  constructor(data: T[], meta: PaginationMetaObject) {
    this.data = data;
    this.meta = meta;
  }

  static empty<T>(): PaginationObject<T> {
    return new PaginationObject(
      [],
      new PaginationMetaObject({
        options: { page: 1, take: 10 },
        total_count: 0,
      }),
    );
  }
}
