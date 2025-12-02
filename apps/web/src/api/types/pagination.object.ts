interface PaginationMetaObject {
  page: number;
  take: number;
  total_count: number;
  page_count: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

export interface PaginationObject<T> {
  data: T[];
  meta: PaginationMetaObject;
}
