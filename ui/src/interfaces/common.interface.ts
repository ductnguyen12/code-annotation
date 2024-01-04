export interface Page<Type> {
  content: Type[],
  totalElements: number,
  totalPages: number,
  number: number,
  size: number,
}

export interface PageParams {
  pageSize: number,
  pageNumber: number,
  sort?: string,
}