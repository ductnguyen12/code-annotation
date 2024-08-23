export interface Page<Type> {
  content: Type[],
  totalElements: number,
  totalPages: number,
  number: number,
  size: number,
}

export interface PageParams {
  size: number,
  page: number,
  sort?: string,
}

export interface PatchRequest {
  op: string,
  field?: string,
  value?: any,
}